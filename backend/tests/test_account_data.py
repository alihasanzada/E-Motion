"""Account-scoped health data regression tests."""

import unittest

from app import app


class AccountDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config["TESTING"] = True
        cls.a = app.test_client()
        cls.b = app.test_client()
        for client, n in [(cls.a, "777781"), (cls.b, "777782")]:
            email = f"st{n}@qu.edu.az"
            response = client.post("/api/register", json={
                "name": f"Test {n}", "email": email, "password": "Testing-1234"
            })
            assert response.status_code == 201, response.get_json()
            response = client.post("/api/login", json={
                "email": email, "password": "Testing-1234"
            })
            assert response.status_code == 200, response.get_json()

    def test_unauthenticated_private_endpoints(self):
        unknown = app.test_client()
        for endpoint in [
            "/api/activity", "/api/moods", "/api/nutrition", "/api/water",
            "/api/messages", "/api/notifications", "/api/challenges", "/api/sleep"
        ]:
            with self.subTest(endpoint=endpoint):
                self.assertEqual(unknown.get(endpoint).status_code, 401)

    def test_activities_water_and_nutrition_isolated(self):
        self.assertEqual(
            self.a.post("/api/activity", json={
                "steps": 12500, "active_minutes": 80, "water_ml": 1500
            }).status_code, 201
        )
        a = self.a.get("/api/activity").get_json()
        b = self.b.get("/api/activity").get_json()
        self.assertEqual(a["steps"], 12500)
        self.assertEqual(a["active_minutes"], 80)
        self.assertEqual(a["water_ml"], 1500)
        self.assertEqual(b["steps"], 0)
        self.assertEqual(self.a.get("/api/water").get_json()["count"], 6)
        self.assertEqual(self.b.get("/api/water").get_json()["count"], 0)

        self.assertEqual(self.a.post(
            "/api/nutrition", json={"meal": "Yulaf", "calories": 320}
        ).status_code, 201)
        self.assertEqual(len(self.a.get("/api/nutrition").get_json()), 1)
        self.assertEqual(len(self.b.get("/api/nutrition").get_json()), 0)

        self.assertEqual(self.b.post("/api/water", json={"count": 3}).status_code, 200)
        self.assertEqual(self.b.get("/api/activity").get_json()["water_ml"], 750)
        self.assertEqual(self.a.get("/api/activity").get_json()["water_ml"], 1500)

    def test_mood_notes_isolated(self):
        self.assertEqual(self.a.post(
            "/api/moods", json={"mood": "Yaxşı", "note": "Şəxsi qeyd A"}
        ).status_code, 201)
        self.assertEqual(len(self.a.get("/api/moods").get_json()), 1)
        self.assertEqual(self.b.get("/api/moods").get_json(), [])

    def test_demo_messages_not_shared(self):
        self.assertEqual(self.a.get("/api/messages").get_json(), [])
        self.assertEqual(self.b.get("/api/messages").get_json(), [])
        self.assertEqual(self.a.get("/api/notifications").get_json(), [])
        self.assertEqual(self.b.get("/api/notifications").get_json(), [])
        self.assertEqual(self.a.post("/api/messages/read-all").status_code, 200)
        self.assertEqual(self.a.post("/api/notifications/read-all").status_code, 200)

    def test_invalid_values_do_not_overwrite(self):
        bad = self.a.post("/api/activity", json={"steps": -10})
        self.assertEqual(bad.status_code, 400)
        bad = self.a.post("/api/nutrition", json={"water_ml": -1})
        self.assertEqual(bad.status_code, 400)

    def test_cross_site_cookie_mutation_needs_app_header(self):
        payload = {"steps": 250, "active_minutes": 15}
        refused = self.a.post(
            "/api/activity", json=payload,
            headers={"Origin": "https://untrusted.example"}
        )
        self.assertEqual(refused.status_code, 403)

        accepted = self.a.post(
            "/api/activity", json=payload,
            headers={
                "Origin": "https://e-motion-iota.vercel.app",
                "X-E-Motion-Request": "1"
            }
        )
        self.assertEqual(accepted.status_code, 201)

    def test_sleep_persists_per_user_and_after_new_login(self):
        self.assertIsNone(self.a.get("/api/sleep").get_json()["hours"])
        self.assertIsNone(self.b.get("/api/sleep").get_json()["hours"])

        saved = self.a.post("/api/sleep", json={"hours": 7.5})
        self.assertEqual(saved.status_code, 200, saved.get_json())
        self.assertEqual(saved.get_json()["hours"], 7.5)
        self.assertEqual(self.a.get("/api/sleep").get_json()["hours"], 7.5)
        self.assertIsNone(self.b.get("/api/sleep").get_json()["hours"])

        # An authenticated fresh session for the same account restores data.
        fresh = app.test_client()
        signed_in = fresh.post("/api/login", json={
            "email": "st777781@qu.edu.az", "password": "Testing-1234"
        })
        self.assertEqual(signed_in.status_code, 200)
        self.assertEqual(fresh.get("/api/sleep").get_json()["hours"], 7.5)

        updated = fresh.post("/api/sleep", json={"hours": 8})
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(self.a.get("/api/sleep").get_json()["hours"], 8.0)
        self.assertIsNone(self.b.get("/api/sleep").get_json()["hours"])

    def test_sleep_rejects_invalid_hours_without_overwriting(self):
        before = self.a.get("/api/sleep").get_json()["hours"]
        for value in [0, 15, -1, 7.3, True, "7", "NaN", None]:
            with self.subTest(value=value):
                response = self.a.post("/api/sleep", json={"hours": value})
                self.assertEqual(response.status_code, 400)
                self.assertEqual(self.a.get("/api/sleep").get_json()["hours"], before)

    def test_z_logout_revokes_session(self):
        self.assertEqual(self.b.post("/api/logout").status_code, 200)
        self.assertEqual(self.b.get("/api/activity").status_code, 401)
        self.assertEqual(self.a.get("/api/activity").status_code, 200)


if __name__ == "__main__":
    unittest.main()
