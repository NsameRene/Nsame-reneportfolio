"""Visitor testimonies: submitted as pending, public only after the owner approves."""
from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from apps.core.testing import ADMIN_EMAIL, staff_client

from .models import Testimonial

SUBMISSION = {
    "name": "Ada Lovelace",
    "role": "CEO, Analytical Co",
    "text": "Working with Nsame was a great experience.",
}


class TestimonialApprovalTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.admin = staff_client()

    def submit(self, **overrides):
        return APIClient().post("/api/testimonials", {**SUBMISSION, **overrides}, format="json")

    def approve(self, pk, value=True):
        return self.admin.patch(f"/api/testimonials/{pk}", {"isApproved": value}, format="json")

    def test_submission_is_saved_as_pending_and_hidden_from_the_public(self):
        response = self.submit()
        self.assertEqual((response.status_code, response.json()), (201, {"success": True, "status": "pending"}))
        self.assertFalse(Testimonial.objects.get().is_approved)
        self.assertEqual(self.client.get("/api/testimonials").json(), [])

    def test_visitor_cannot_approve_their_own_submission(self):
        self.submit(isApproved=True, is_approved=True)
        self.assertFalse(Testimonial.objects.get().is_approved)
        self.assertEqual(self.client.get("/api/testimonials").json(), [])

    def test_pending_item_is_not_retrievable_by_the_public(self):
        self.submit()
        pk = Testimonial.objects.get().pk
        self.assertEqual(self.client.get(f"/api/testimonials/{pk}").status_code, 404)
        self.assertEqual(self.admin.get(f"/api/testimonials/{pk}").status_code, 200)

    def test_approval_publishes_it_and_unapproving_hides_it_again(self):
        self.submit()
        pk = Testimonial.objects.get().pk
        self.assertEqual(self.approve(pk).status_code, 200)
        public = self.client.get("/api/testimonials").json()
        self.assertEqual([t["name"] for t in public], ["Ada Lovelace"])
        self.assertEqual(set(public[0]), {"id", "name", "role", "text", "isApproved", "createdAt"})
        self.approve(pk, False)
        self.assertEqual(self.client.get("/api/testimonials").json(), [])

    def test_owner_sees_everything_with_pending_first(self):
        Testimonial.objects.create(name="Old approved", text="x" * 20, is_approved=True)
        self.submit(name="New pending")
        self.assertEqual([t["name"] for t in self.admin.get("/api/testimonials").json()], ["New pending", "Old approved"])
        self.assertEqual([t["name"] for t in self.client.get("/api/testimonials").json()], ["Old approved"])

    def test_only_staff_can_moderate(self):
        self.submit()
        pk = Testimonial.objects.get().pk
        anon = APIClient()
        self.assertEqual(anon.patch(f"/api/testimonials/{pk}", {"isApproved": True}, format="json").status_code, 401)
        self.assertEqual(anon.delete(f"/api/testimonials/{pk}").status_code, 401)

        user = get_user_model().objects.create_user("v", "v@example.com", "long-password-here-1")
        visitor = APIClient()
        visitor.credentials(HTTP_AUTHORIZATION=f"Bearer {AccessToken.for_user(user)}")
        self.assertEqual(visitor.patch(f"/api/testimonials/{pk}", {"isApproved": True}, format="json").status_code, 403)
        self.assertFalse(Testimonial.objects.get().is_approved)

    def test_owner_can_delete(self):
        self.submit()
        response = self.admin.delete(f"/api/testimonials/{Testimonial.objects.get().pk}")
        self.assertEqual((response.status_code, response.json()), (200, {"success": True}))
        self.assertEqual(Testimonial.objects.count(), 0)

    def test_validation_and_default_role(self):
        for bad in ({"name": ""}, {"name": "   "}, {"text": "short"}, {"text": "x" * 1501}, {"name": "n" * 121}):
            self.assertEqual(self.submit(**bad).status_code, 400, bad)
        self.assertEqual(Testimonial.objects.count(), 0)
        cache.clear()  # invalid attempts also count toward the rate limit
        self.assertEqual(self.submit(role="").status_code, 201)
        self.assertEqual(Testimonial.objects.get().role, "Client")  # the site's existing default label

    def test_submissions_are_rate_limited(self):
        codes = [self.submit().status_code for _ in range(12)]
        self.assertEqual(codes[:10], [201] * 10)
        self.assertEqual(codes[10:], [429, 429])

    def test_owner_is_emailed_when_configured(self):
        with override_settings(CONTACT_NOTIFY_EMAIL="me@example.com", EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend"):
            self.submit()
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("awaits approval", mail.outbox[0].subject)
        self.assertIn("great experience", mail.outbox[0].body)

    def test_django_admin_bulk_approve_action(self):
        self.submit()
        self.client.force_login(get_user_model().objects.get(email=ADMIN_EMAIL))
        pk = Testimonial.objects.get().pk
        response = self.client.post(
            "/admin/content/testimonial/", {"action": "approve", "_selected_action": [pk]}, follow=True
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Testimonial.objects.get().is_approved)
