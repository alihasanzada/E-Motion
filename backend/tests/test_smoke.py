"""Small regression checks for the E-Motion backend (no live services required)."""

import unittest

from app import app


class BackendSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config["TESTING"] = True
        cls.client = app.test_client()

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], "ok")

    def test_allowed_frontend_origin_preflight(self):
        response = self.client.options(
            "/api/login",
            headers={
                "Origin": "https://e-motion-iota.vercel.app",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.headers.get("Access-Control-Allow-Origin"),
            "https://e-motion-iota.vercel.app",
        )
        self.assertEqual(
            response.headers.get("Access-Control-Allow-Credentials"), "true"
        )

    def test_unknown_origin_not_allowed(self):
        response = self.client.get(
            "/health", headers={"Origin": "https://not-the-frontend.example"}
        )
        self.assertNotIn("Access-Control-Allow-Origin", response.headers)

    def test_login_validates_missing_credentials(self):
        response = self.client.post("/api/login", json={})
        self.assertEqual(response.status_code, 400)

    def test_activity_requires_login(self):
        response = self.client.get("/api/activity")
        self.assertEqual(response.status_code, 401)
        self.assertIn("error", response.get_json())


    def test_student_records_are_not_public(self):
        response = self.client.get("/api/students")
        self.assertEqual(response.status_code, 403)
        self.assertNotIn("st123456", response.get_data(as_text=True))

    def test_unrestricted_campus_admin_mutations_disabled(self):
        for path in ["/api/events", "/api/courses", "/api/resources"]:
            with self.subTest(path=path):
                response = self.client.post(path, json={"title": "Test"})
                self.assertEqual(response.status_code, 403)


if __name__ == "__main__":
    unittest.main()
