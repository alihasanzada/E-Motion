"""Regression checks for preview proxy rate limiting and JSON errors."""

import unittest

from app import app


class RateLimitTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config["TESTING"] = True

    def test_normal_dashboard_use_does_not_exhaust_hourly_limit(self):
        client = app.test_client()
        email = "st775691@qu.edu.az"
        signup = client.post("/api/register", json={
            "name": "Limit Sınağı", "email": email, "password": "Testing-1234"
        })
        self.assertEqual(signup.status_code, 201, signup.get_json())
        login = client.post("/api/login", json={
            "email": email, "password": "Testing-1234"
        })
        self.assertEqual(login.status_code, 200, login.get_json())

        # The previous shared-IP limit rejected subsequent requests after 50.
        for index in range(75):
            with self.subTest(index=index):
                response = client.get("/api/activity")
                self.assertEqual(response.status_code, 200)

        write = client.post("/api/activity", json={
            "steps": 4200, "active_minutes": 15
        })
        self.assertEqual(write.status_code, 201, write.get_json())
        self.assertEqual(client.get("/api/activity").get_json()["steps"], 4200)

    def test_login_throttle_has_readable_json_response(self):
        client = app.test_client()
        attempt = {"email": "st775692@qu.edu.az", "password": "incorrect!"}

        for _ in range(10):
            response = client.post("/api/login", json=attempt)
            self.assertEqual(response.status_code, 401)

        response = client.post("/api/login", json=attempt)
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.get_json()["code"], "rate_limited")
        self.assertIn("error", response.get_json())


if __name__ == "__main__":
    unittest.main()
