from rest_framework import serializers

from apps.core.serializers import CamelCaseModelSerializer, MediaSerializer
from apps.core.validators import validate_link

from .models import (
    Blog,
    Certificate,
    Course,
    Education,
    Experience,
    GalleryItem,
    Project,
    Quote,
    SiteSettings,
    Skill,
    WhatIDo,
)


class ProjectSerializer(MediaSerializer):
    class Meta:
        model = Project
        fields = [
            "id", "title", "description", "technologies", "image", "image_url",
            "github_link", "live_demo_link", "category", "featured", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class BlogSerializer(MediaSerializer):
    url_field = "cover_image"

    class Meta:
        model = Blog
        fields = [
            "id", "title", "slug", "content", "image", "cover_image",
            "category", "tags", "published_at", "reading_time",
        ]
        read_only_fields = ["id"]


class CourseSerializer(MediaSerializer):
    class Meta:
        model = Course
        fields = ["id", "title", "description", "image", "image_url", "link"]
        read_only_fields = ["id"]


class GallerySerializer(MediaSerializer):
    class Meta:
        model = GalleryItem
        fields = ["id", "title", "image", "image_url", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if self.instance is None and not (attrs.get("image") or attrs.get("image_url")):
            raise serializers.ValidationError("Upload an image or provide an image URL.")
        return attrs


class SkillSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "category", "proficiency"]
        read_only_fields = ["id"]


class ExperienceSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Experience
        fields = ["id", "company", "role", "start_date", "end_date", "description"]
        read_only_fields = ["id"]


class EducationSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Education
        fields = ["id", "institution", "degree", "start_date", "end_date", "description"]
        read_only_fields = ["id"]


class CertificateSerializer(CamelCaseModelSerializer):
    link = serializers.CharField(required=False, allow_blank=True, max_length=500, validators=[validate_link])

    class Meta:
        model = Certificate
        fields = ["id", "name", "issuer", "date", "link"]
        read_only_fields = ["id"]


class QuoteSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Quote
        fields = ["id", "text", "author"]
        read_only_fields = ["id"]


class WhatIDoSerializer(CamelCaseModelSerializer):
    class Meta:
        model = WhatIDo
        fields = ["id", "title", "icon", "items"]
        read_only_fields = ["id"]


class SiteSettingsSerializer(MediaSerializer):
    file_field = "profile_image"
    url_field = "profile_image_url"

    class Meta:
        model = SiteSettings
        fields = [
            "id", "name", "email", "bio", "profile_image", "profile_image_url",
            "phone", "location", "website",
        ]
        read_only_fields = ["id"]
