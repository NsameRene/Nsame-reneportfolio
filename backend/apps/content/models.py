"""Portfolio content. One model per table of the old Drizzle schema
(backend/src/db/schema.ts in the Node version), same field semantics:

* ``technologies`` / ``tags`` / ``items`` stay comma-separated text because the
  frontend splits them on "," itself.
* ``start_date`` / ``end_date`` / ``date`` stay free text ("2021", "Present").
* Images can be uploaded (``image``) or linked (``image_url``); the API exposes
  whichever is set as a single ``imageUrl``.
"""
from django.core.validators import MaxValueValidator
from django.db import models
from django.utils import timezone

from apps.core.models import OrderedModel
from apps.core.validators import IMAGE_VALIDATORS, validate_link

LINK = {"max_length": 500, "blank": True, "validators": [validate_link]}


class Project(OrderedModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    technologies = models.CharField(
        max_length=1000, blank=True, help_text="Comma-separated, e.g. React, Node.js, PostgreSQL"
    )
    image = models.ImageField(upload_to="projects/", blank=True, validators=IMAGE_VALIDATORS)
    image_url = models.CharField(
        "image URL", help_text="Used when no image is uploaded.", **LINK
    )
    github_link = models.CharField("GitHub link", **LINK)
    live_demo_link = models.CharField("live demo link", **LINK)
    category = models.CharField(max_length=100, blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta(OrderedModel.Meta):
        pass

    def __str__(self):
        return self.title


class Blog(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    content = models.TextField()
    image = models.ImageField("cover image (upload)", upload_to="blog/", blank=True, validators=IMAGE_VALIDATORS)
    cover_image = models.CharField(
        "cover image URL", help_text="Used when no image is uploaded.", **LINK
    )
    category = models.CharField(max_length=100, blank=True)
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated")
    published_at = models.DateTimeField(default=timezone.now)
    reading_time = models.PositiveIntegerField(default=5, help_text="Minutes")

    class Meta:
        ordering = ["-published_at", "-id"]
        verbose_name = "blog post"

    def __str__(self):
        return self.title


class Skill(OrderedModel):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, help_text="e.g. Frontend, Backend, Database")
    proficiency = models.PositiveIntegerField(validators=[MaxValueValidator(100)], help_text="0 – 100")

    class Meta(OrderedModel.Meta):
        pass

    def __str__(self):
        return f"{self.name} ({self.category})"


class Experience(OrderedModel):
    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    start_date = models.CharField(max_length=50, help_text='Free text, e.g. "2021" or "Jan 2021"')
    end_date = models.CharField(max_length=50, blank=True, help_text='e.g. "2024" or "Present"')
    description = models.TextField()

    class Meta(OrderedModel.Meta):
        pass

    def __str__(self):
        return f"{self.role} at {self.company}"


class Education(OrderedModel):
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name_plural = "education"

    def __str__(self):
        return f"{self.degree}, {self.institution}"


class Certificate(OrderedModel):
    name = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255)
    date = models.CharField(max_length=50, help_text='Free text, e.g. "2022"')
    link = models.CharField("credential link", **LINK)

    class Meta(OrderedModel.Meta):
        pass

    def __str__(self):
        return self.name


class Course(OrderedModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to="courses/", blank=True, validators=IMAGE_VALIDATORS)
    image_url = models.CharField("image URL", help_text="Used when no image is uploaded.", **LINK)
    link = models.CharField("course link", **LINK)

    class Meta(OrderedModel.Meta):
        pass

    def __str__(self):
        return self.title


class Quote(OrderedModel):
    """Testimonials / quotes shown on the Testimonials page."""

    text = models.TextField()
    author = models.CharField(max_length=255)

    class Meta(OrderedModel.Meta):
        pass

    def __str__(self):
        return f"{self.author}: {self.text[:50]}"


class GalleryItem(OrderedModel):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to="gallery/", blank=True, validators=IMAGE_VALIDATORS)
    image_url = models.CharField(
        "image URL", help_text="Used when no image is uploaded. Provide one or the other.", **LINK
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta(OrderedModel.Meta):
        verbose_name = "gallery item"

    def __str__(self):
        return self.title

    def clean(self):
        from django.core.exceptions import ValidationError

        if not self.image and not self.image_url:
            raise ValidationError("Upload an image or provide an image URL.")


class WhatIDo(OrderedModel):
    """The "What I do" cards on the home page."""

    title = models.CharField(max_length=255)
    icon = models.CharField(max_length=50, help_text="Lucide icon name: Globe, Terminal, Database, …")
    items = models.TextField(help_text="Comma-separated, e.g. React, Next.js, TypeScript")

    class Meta(OrderedModel.Meta):
        verbose_name = "what I do card"
        verbose_name_plural = "what I do cards"

    def __str__(self):
        return self.title


class SiteSettings(models.Model):
    """Single-row profile settings (the old ``settings`` table, always id=1)."""

    name = models.CharField(max_length=255, blank=True)
    email = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(
        "profile image (upload)", upload_to="profile/", blank=True, validators=IMAGE_VALIDATORS
    )
    profile_image_url = models.CharField(
        "profile image URL", help_text="Used when no image is uploaded.", **LINK
    )
    phone = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=255, blank=True)
    website = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "site settings"
        verbose_name_plural = "site settings"

    def __str__(self):
        return "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1  # singleton
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Testimonial(models.Model):
    """A testimony submitted by a visitor. It stays hidden from the public
    site until the owner approves it (dashboard or Django admin)."""

    name = models.CharField(max_length=120)
    role = models.CharField("role / company", max_length=120, blank=True)
    text = models.TextField("testimony", max_length=1500)
    is_approved = models.BooleanField(
        "approved", default=False, db_index=True, help_text="Only approved testimonies appear on the public site."
    )
    created_at = models.DateTimeField("submitted at", auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"{self.name} ({'approved' if self.is_approved else 'pending'})"
