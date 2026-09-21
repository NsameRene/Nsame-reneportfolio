from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase

from .models import ContactMessage

# Exactly what frontend/src/pages/Contact.tsx posts.
FORM = {
    "projectType": "Web Development",
    "budget": "$5k - $10k",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "message": "I would like a website.",
}


class ContactTests(APITestCase):
    def setUp(self):
        cache.clear()

    def test_frontend_payload_is_stored_and_returns_success(self):
        response = self.client.post("/api/contact", FORM, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"success": True})
        msg = ContactMessage.objects.get()
        self.assertEqual((msg.name, msg.email, msg.project_type, msg.budget), ("Ada Lovelace", "ada@example.com", "Web Development", "$5k - $10k"))
        self.assertEqual(msg.subject, "Web Development inquiry from Ada Lovelace")

    def test_explicit_subject_is_kept(self):
        self.client.post("/api/contact", {**FORM, "subject": "Hello"}, format="json")
        self.assertEqual(ContactMessage.objects.get().subject, "Hello")

    def test_validation_errors(self):
        for bad in ({**FORM, "email": "not-an-email"}, {**FORM, "message": ""}, {**FORM, "name": "   "}, {"name": "x"}):
            response = self.client.post("/api/contact", bad, format="json")
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.data["error"], "Validation failed")
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_message_length_limit(self):
        response = self.client.post("/api/contact", {**FORM, "message": "x" * 5001}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_messages_are_not_publicly_readable(self):
        self.client.post("/api/contact", FORM, format="json")
        self.assertEqual(self.client.get("/api/contact").status_code, 405)

    @override_settings(CONTACT_NOTIFY_EMAIL="me@example.com", EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
    def test_notification_email_sent_when_configured(self):
        self.client.post("/api/contact", FORM, format="json")
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["me@example.com"])
        self.assertIn("I would like a website.", mail.outbox[0].body)

    @override_settings(CONTACT_NOTIFY_EMAIL="me@example.com", EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
    def test_email_failure_does_not_lose_message(self):
        from unittest import mock

        with mock.patch("apps.core.notifications.send_mail", side_effect=OSError("smtp down")):
            with self.assertLogs("apps.core.notifications", level="ERROR"):
                response = self.client.post("/api/contact", FORM, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_no_email_when_not_configured(self):
        self.client.post("/api/contact", FORM, format="json")
        self.assertEqual(len(mail.outbox), 0)

    def test_rate_limited(self):
        codes = [self.client.post("/api/contact", FORM, format="json").status_code for _ in range(12)]
        self.assertEqual(codes[:10], [200] * 10)
        self.assertEqual(codes[10:], [429, 429])

    def test_admin_inbox_visible_to_staff_only_via_admin_site(self):
        self.client.post("/api/contact", FORM, format="json")
        self.assertEqual(self.client.get("/admin/contact/contactmessage/").status_code, 302)  # login redirect
        from apps.core.testing import make_staff

        make_staff()
        self.client.login(username="owner", password="correct-horse-battery-9")
        response = self.client.get("/admin/contact/contactmessage/")
        self.assertContains(response, "Ada Lovelace")
