from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APIClient, APITestCase

from apps.core.testing import ADMIN_EMAIL, ADMIN_PASSWORD, make_staff


class AuthTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.staff = make_staff()

    def login(self, email=ADMIN_EMAIL, password=ADMIN_PASSWORD):
        return self.client.post("/api/auth/login", {"email": email, "password": password}, format="json")

    def test_login_returns_token_and_user_like_node_api(self):
        response = self.login()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.data), {"token", "user"})
        self.assertEqual(response.data["user"], {"email": ADMIN_EMAIL, "role": "admin"})

    def test_login_email_is_case_insensitive(self):
        self.assertEqual(self.login(email=ADMIN_EMAIL.upper()).status_code, 200)

    def test_wrong_password_unknown_email_and_missing_fields_are_401_with_error_key(self):
        for response in (
            self.login(password="nope"),
            self.login(email="nobody@example.com"),
            self.client.post("/api/auth/login", {}, format="json"),
            self.client.post("/api/auth/login", {"email": ["a"], "password": {"b": 1}}, format="json"),
        ):
            self.assertEqual(response.status_code, 401)
            self.assertEqual(response.data, {"error": "Invalid credentials"})

    def test_non_staff_user_cannot_log_in(self):
        get_user_model().objects.create_user("visitor", "visitor@example.com", "another-long-pass-1")
        self.assertEqual(self.login("visitor@example.com", "another-long-pass-1").status_code, 401)

    def test_inactive_staff_cannot_log_in(self):
        self.staff.is_active = False
        self.staff.save()
        self.assertEqual(self.login().status_code, 401)

    def test_check_with_valid_token(self):
        token = self.login().data["token"]
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = client.post("/api/auth/check")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user"]["email"], ADMIN_EMAIL)

    def test_check_rejects_missing_and_bad_tokens(self):
        self.assertEqual(APIClient().post("/api/auth/check").status_code, 401)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Bearer not.a.token")
        response = client.post("/api/auth/check")
        self.assertEqual(response.status_code, 401)
        self.assertIn("error", response.data)

    def test_token_of_demoted_user_is_rejected(self):
        token = self.login().data["token"]
        self.staff.is_staff = False
        self.staff.save()
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(client.post("/api/auth/check").status_code, 403)

    def test_login_is_rate_limited(self):
        from django.core.cache import cache

        cache.clear()
        statuses = [self.login(password="bad").status_code for _ in range(12)]
        self.assertEqual(statuses[:10], [401] * 10)
        self.assertEqual(statuses[10:], [429, 429])
        cache.clear()
