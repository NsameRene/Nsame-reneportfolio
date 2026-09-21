import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework.test import APIClient, APITestCase

from apps.core.testing import png_upload, staff_client

from .models import Blog, Course, GalleryItem, Project, SiteSettings

PUBLIC_LISTS = [
    "projects", "blogs", "skills", "experiences", "certificates",
    "courses", "quotes", "gallery", "education", "what_i_do",
]

# One valid multipart payload per endpoint, using the field names the React
# admin form (frontend/src/pages/Admin.tsx) submits.
PAYLOADS = {
    "projects": {"title": "P", "description": "d", "technologies": "React, Django", "category": "Web", "liveDemoLink": "https://x.dev", "imageUrl": "https://img.test/p.png"},
    "blogs": {"title": "B", "slug": "b-post", "content": "c", "category": "Eng", "coverImage": "https://img.test/b.png"},
    "courses": {"title": "C", "description": "d", "imageUrl": "https://img.test/c.png"},
    "quotes": {"text": "Great work", "author": "Jane"},
    "gallery": {"title": "G", "imageUrl": "https://img.test/g.png"},
    "education": {"institution": "Uni", "degree": "BSc", "startDate": "2014", "endDate": "2018"},
    "experiences": {"company": "Co", "role": "Dev", "startDate": "2020", "endDate": "", "description": "did things"},
    "skills": {"name": "Python", "category": "Backend", "proficiency": "90"},
    "certificates": {"name": "Cert", "issuer": "Issuer", "date": "2022", "link": ""},
    "what_i_do": {"title": "Frontend", "icon": "Globe", "items": "React, Vue"},
}


class TempMediaMixin:
    def setUp(self):
        super().setUp()
        self._media = tempfile.mkdtemp()
        override = override_settings(MEDIA_ROOT=self._media)
        override.enable()
        self.addCleanup(override.disable)
        self.addCleanup(shutil.rmtree, self._media, True)


class PublicReadTests(APITestCase):
    def test_every_list_endpoint_is_public_and_returns_a_plain_array(self):
        for name in PUBLIC_LISTS:
            response = self.client.get(f"/api/{name}")
            self.assertEqual(response.status_code, 200, name)
            self.assertEqual(response.json(), [], name)

    def test_json_keys_are_camel_case_like_the_node_api(self):
        Project.objects.create(title="T", description="d", image_url="https://i/x.png", github_link="https://g", live_demo_link="https://l")
        item = self.client.get("/api/projects").json()[0]
        self.assertEqual(
            set(item),
            {"id", "title", "description", "technologies", "imageUrl", "githubLink", "liveDemoLink", "category", "featured", "createdAt"},
        )
        Blog.objects.create(title="T", slug="t", content="c")
        self.assertEqual(
            set(self.client.get("/api/blogs").json()[0]),
            {"id", "title", "slug", "content", "coverImage", "category", "tags", "publishedAt", "readingTime"},
        )

    def test_settings_row_is_created_on_first_read(self):
        response = self.client.get("/api/settings")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {"id": 1, "name": "", "email": "", "bio": "", "profileImageUrl": "", "phone": "", "location": "", "website": ""},
        )
        self.assertEqual(SiteSettings.objects.count(), 1)

    def test_blog_is_retrievable_by_slug_and_by_id(self):
        blog = Blog.objects.create(title="Hello", slug="hello-world", content="c")
        by_slug = self.client.get("/api/blogs/hello-world")
        by_id = self.client.get(f"/api/blogs/{blog.pk}")
        self.assertEqual(by_slug.status_code, 200)
        self.assertEqual(by_slug.json(), by_id.json())
        self.assertEqual(self.client.get("/api/blogs/missing").status_code, 404)
        self.assertEqual(self.client.get("/api/blogs/9999").status_code, 404)

    def test_blogs_newest_first_and_manual_order_for_others(self):
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        Blog.objects.create(title="old", slug="old", content="c", published_at=now - timedelta(days=5))
        Blog.objects.create(title="new", slug="new", content="c", published_at=now)
        self.assertEqual([b["slug"] for b in self.client.get("/api/blogs").json()], ["new", "old"])

        Course.objects.create(title="second", description="d", order=2)
        Course.objects.create(title="first", description="d", order=1)
        Course.objects.create(title="zero-a", description="d")
        Course.objects.create(title="zero-b", description="d")
        self.assertEqual([c["title"] for c in self.client.get("/api/courses").json()], ["zero-a", "zero-b", "first", "second"])


class WriteAuthTests(APITestCase):
    def test_anonymous_writes_are_rejected_on_every_endpoint(self):
        for name in PUBLIC_LISTS:
            self.assertEqual(self.client.post(f"/api/{name}", PAYLOADS[name], format="multipart").status_code, 401, name)
            self.assertEqual(self.client.put(f"/api/{name}/1", PAYLOADS[name], format="multipart").status_code, 401, name)
            self.assertEqual(self.client.delete(f"/api/{name}/1").status_code, 401, name)
        self.assertEqual(self.client.put("/api/settings", {"name": "x"}, format="json").status_code, 401)

    def test_authenticated_non_staff_user_gets_403(self):
        from rest_framework_simplejwt.tokens import AccessToken

        user = get_user_model().objects.create_user("v", "v@example.com", "long-password-here-1")
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {AccessToken.for_user(user)}")
        self.assertEqual(client.post("/api/projects", PAYLOADS["projects"], format="multipart").status_code, 403)
        self.assertEqual(client.put("/api/settings", {"name": "x"}, format="json").status_code, 403)

    def test_error_body_uses_error_key(self):
        response = self.client.post("/api/projects", {}, format="json")
        self.assertEqual(response.data, {"error": "Authentication credentials were not provided."})


class CrudTests(TempMediaMixin, APITestCase):
    def setUp(self):
        super().setUp()
        self.admin = staff_client()

    def test_create_update_delete_on_every_endpoint_with_multipart_like_the_admin_form(self):
        for name in PUBLIC_LISTS:
            created = self.admin.post(f"/api/{name}", PAYLOADS[name], format="multipart")
            self.assertEqual(created.status_code, 201, (name, created.content))
            obj_id = created.json()["id"]
            self.assertEqual(len(self.client.get(f"/api/{name}").json()), 1, name)

            first_key = next(iter(PAYLOADS[name]))
            updated = self.admin.put(f"/api/{name}/{obj_id}", {first_key: PAYLOADS[name][first_key] + "!"} if name != "skills" else {"name": "Rust"}, format="multipart")
            self.assertEqual(updated.status_code, 200, (name, updated.content))

            deleted = self.admin.delete(f"/api/{name}/{obj_id}")
            self.assertEqual((deleted.status_code, deleted.json()), (200, {"success": True}), name)
            self.assertEqual(self.client.get(f"/api/{name}").json(), [], name)

    def test_json_bodies_work_too(self):
        response = self.admin.post("/api/skills", {"name": "Go", "category": "Backend", "proficiency": 70}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["proficiency"], 70)

    def test_put_is_partial_and_does_not_reset_featured(self):
        project = Project.objects.create(title="Keep", description="d", featured=True, category="Web")
        # The admin form does not send `featured`; Node reset it to false here.
        self.admin.put(f"/api/projects/{project.pk}", {"title": "Renamed"}, format="multipart")
        project.refresh_from_db()
        self.assertEqual((project.title, project.featured, project.category), ("Renamed", True, "Web"))
        self.admin.put(f"/api/projects/{project.pk}", {"featured": "false"}, format="multipart")
        project.refresh_from_db()
        self.assertFalse(project.featured)

    def test_update_or_delete_missing_row_is_404(self):
        self.assertEqual(self.admin.put("/api/projects/999", {"title": "x"}, format="multipart").status_code, 404)
        self.assertEqual(self.admin.delete("/api/projects/999").status_code, 404)

    def test_validation_errors_are_400_not_500(self):
        cases = [
            ("skills", {"name": "x", "category": "y", "proficiency": "101"}),
            ("skills", {"name": "x", "category": "y", "proficiency": "abc"}),
            ("projects", {"description": "missing title"}),
            ("projects", {"title": "t", "description": "d", "liveDemoLink": "javascript:alert(1)"}),
            ("projects", {"title": "t", "description": "d", "imageUrl": "data:text/html,<script>"}),
            ("gallery", {"title": "no image"}),
        ]
        for name, body in cases:
            response = self.admin.post(f"/api/{name}", body, format="multipart")
            self.assertEqual(response.status_code, 400, (name, body))
            self.assertEqual(response.json()["error"], "Validation failed")

    def test_duplicate_blog_slug_is_400(self):
        self.admin.post("/api/blogs", PAYLOADS["blogs"], format="multipart")
        self.assertEqual(self.admin.post("/api/blogs", PAYLOADS["blogs"], format="multipart").status_code, 400)

    def test_legacy_placeholder_links_are_accepted(self):
        response = self.admin.post("/api/projects", {"title": "t", "description": "d", "githubLink": "#", "liveDemoLink": "/relative"}, format="multipart")
        self.assertEqual(response.status_code, 201)

    def test_settings_put_returns_success_and_persists(self):
        response = self.admin.put("/api/settings", {"name": "Nsame", "email": "n@example.com", "bio": "hi", "profileImageUrl": "https://i/me.png"}, format="json")
        self.assertEqual((response.status_code, response.json()), (200, {"success": True}))
        got = self.client.get("/api/settings").json()
        self.assertEqual((got["name"], got["email"], got["profileImageUrl"]), ("Nsame", "n@example.com", "https://i/me.png"))


class UploadTests(TempMediaMixin, APITestCase):
    def setUp(self):
        super().setUp()
        self.admin = staff_client()

    def create_with_upload(self):
        body = {"title": "With image", "description": "d", "image": png_upload()}
        return self.admin.post("/api/projects", body, format="multipart")

    def test_uploaded_image_is_stored_and_exposed_as_absolute_media_url(self):
        response = self.create_with_upload()
        self.assertEqual(response.status_code, 201, response.content)
        url = response.json()["imageUrl"]
        self.assertRegex(url, r"^http://testserver/media/projects/pic.*\.png$")
        project = Project.objects.get()
        self.assertTrue(project.image.storage.exists(project.image.name))
        self.assertEqual(project.image_url, "")
        self.assertNotIn("image", response.json())  # file field itself is write-only

    def test_upload_is_served_in_public_list(self):
        self.create_with_upload()
        self.assertTrue(self.client.get("/api/projects").json()[0]["imageUrl"].startswith("http://testserver/media/projects/"))

    def test_echoing_current_url_back_keeps_the_upload(self):
        project_id = self.create_with_upload().json()["id"]
        current = self.client.get("/api/projects").json()[0]["imageUrl"]
        # The admin form pre-fills imageUrl with the current value and sends it back.
        self.admin.put(f"/api/projects/{project_id}", {"title": "Edited", "imageUrl": current}, format="multipart")
        project = Project.objects.get()
        self.assertTrue(project.image)
        self.assertEqual(project.image_url, "")

    def test_new_external_url_replaces_the_upload(self):
        project_id = self.create_with_upload().json()["id"]
        self.admin.put(f"/api/projects/{project_id}", {"imageUrl": "https://cdn.test/new.png"}, format="multipart")
        project = Project.objects.get()
        self.assertFalse(project.image)
        self.assertEqual(self.client.get("/api/projects").json()[0]["imageUrl"], "https://cdn.test/new.png")

    def test_new_upload_replaces_external_url(self):
        project = Project.objects.create(title="t", description="d", image_url="https://old.test/x.png")
        self.admin.put(f"/api/projects/{project.pk}", {"image": png_upload("new.png")}, format="multipart")
        project.refresh_from_db()
        self.assertTrue(project.image)
        self.assertEqual(project.image_url, "")

    def test_blog_cover_and_settings_profile_uploads_use_their_own_field_names(self):
        blog = self.admin.post("/api/blogs", {**PAYLOADS["blogs"], "coverImage": "", "image": png_upload()}, format="multipart")
        self.assertRegex(blog.json()["coverImage"], r"/media/blog/")
        self.admin.put("/api/settings", {"profileImage": png_upload("me.png")}, format="multipart")
        self.assertRegex(self.client.get("/api/settings").json()["profileImageUrl"], r"/media/profile/me.*\.png$")

    def test_gallery_accepts_upload_only(self):
        response = self.admin.post("/api/gallery", {"title": "Pic", "image": png_upload()}, format="multipart")
        self.assertEqual(response.status_code, 201, response.content)
        self.assertRegex(response.json()["imageUrl"], r"/media/gallery/")

    def test_non_image_content_is_rejected(self):
        fake = SimpleUploadedFile("evil.png", b"<?php echo 1; ?>", content_type="image/png")
        response = self.admin.post("/api/projects", {"title": "t", "description": "d", "image": fake}, format="multipart")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Project.objects.count(), 0)

    def test_disallowed_extensions_are_rejected_even_if_valid_images(self):
        import io
        from PIL import Image

        buffer = io.BytesIO()
        Image.new("RGB", (2, 2)).save(buffer, "PNG")
        for name in ("shell.php", "pic.svg", "pic.html"):
            upload = SimpleUploadedFile(name, buffer.getvalue(), content_type="image/png")
            response = self.admin.post("/api/projects", {"title": "t", "description": "d", "image": upload}, format="multipart")
            self.assertEqual(response.status_code, 400, name)

    @override_settings(MAX_UPLOAD_SIZE=100)
    def test_oversized_upload_is_rejected(self):
        response = self.admin.post("/api/projects", {"title": "t", "description": "d", "image": png_upload(size=(200, 200))}, format="multipart")
        self.assertEqual(response.status_code, 400)
        self.assertIn("too large", str(response.json()))

    def test_anonymous_cannot_upload(self):
        response = self.client.post("/api/projects", {"title": "t", "description": "d", "image": png_upload()}, format="multipart")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(GalleryItem.objects.count() + Project.objects.count(), 0)


class SiteSettingsModelTests(APITestCase):
    def test_singleton(self):
        SiteSettings.objects.create(name="a")
        SiteSettings(name="b").save()  # save() forces pk=1 -> overwrites the row
        self.assertEqual(SiteSettings.objects.count(), 1)
        self.assertEqual(SiteSettings.objects.get().name, "b")
