"""Session and per-user profile regression tests for E-Motion."""

import unittest

from app import app


class AuthProfileTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config["TESTING"] = True

    def test_profile_requires_valid_session(self):
        unauthenticated = app.test_client()
        result = unauthenticated.get("/api/user/profile")
        self.assertEqual(result.status_code, 401)
        unauthenticated.set_cookie("token", "definitely-not-a-valid-token")
        result = unauthenticated.get("/api/user/profile")
        self.assertEqual(result.status_code, 401)

    def test_two_users_have_isolated_profiles(self):
        alice = app.test_client()
        bob = app.test_client()
        credentials = [
            ("st888881@qu.edu.az", "Testing-1234", "Test Tələbə A", alice),
            ("st888882@qu.edu.az", "Testing-5678", "Test Tələbə B", bob),
        ]

        for email, password, name, client in credentials:
            response = client.post("/api/register", json={
                "name": name, "email": email, "password": password
            })
            self.assertEqual(response.status_code, 201, response.get_json())
            response = client.post("/api/login", json={
                "email": email, "password": password
            })
            self.assertEqual(response.status_code, 200, response.get_json())
            cookie = response.headers.get("Set-Cookie", "")
            self.assertIn("token=", cookie)
            self.assertIn("HttpOnly", cookie)
            self.assertNotIn("auth-token-xyz-12345", cookie)

        profile_a = alice.get("/api/user/profile")
        profile_b = bob.get("/api/user/profile")
        self.assertEqual(profile_a.status_code, 200)
        self.assertEqual(profile_b.status_code, 200)
        self.assertEqual(profile_a.get_json()["email"], "st888881@qu.edu.az")
        self.assertEqual(profile_b.get_json()["email"], "st888882@qu.edu.az")

        update = alice.post("/api/user/profile", json={
            "fullname": "Test Tələbə A",
            "major": "Kompüter Mühəndisliyi",
            "course": 2,
            "phone": "+994 00 000 00 00",
            "daily_step_goal": 8500,
            "daily_water_goal": 2000,
        })
        self.assertEqual(update.status_code, 200, update.get_json())
        self.assertEqual(
            alice.get("/api/user/profile").get_json()["daily_step_goal"], 8500
        )
        self.assertEqual(
            bob.get("/api/user/profile").get_json()["daily_step_goal"], 10000
        )
        self.assertEqual(bob.get("/api/user/profile").get_json()["phone"], "")

        # A login cookie must not grant access to another user's email.
        denied = alice.post(
            "/api/user/profile", json={"email": "st888882@qu.edu.az"}
        )
        self.assertEqual(denied.status_code, 403)


if __name__ == "__main__":
    unittest.main()
