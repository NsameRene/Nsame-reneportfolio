from django.http import Http404
from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.core.notifications import notify_owner
from apps.core.permissions import IsStaff, is_admin

from . import serializers as s
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
    Testimonial,
    WhatIDo,
)


class ContentViewSet(viewsets.ModelViewSet):
    """Public reads, staff-only writes, mirroring the Express routes:

    GET /api/<name>  ·  POST /api/<name>  ·  PUT|DELETE /api/<name>/<id>

    * PUT is a partial update: fields that are not sent are left untouched
      (the Node API ignored undefined fields the same way).
    * DELETE answers ``{"success": true}`` like Node did.
    """

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response({"success": True})


class ProjectViewSet(ContentViewSet):
    queryset = Project.objects.all()
    serializer_class = s.ProjectSerializer


class BlogViewSet(ContentViewSet):
    queryset = Blog.objects.all()
    serializer_class = s.BlogSerializer
    lookup_value_regex = "[^/]+"

    def get_object(self):
        """Accept a numeric id (admin panel) or a slug (public article page)."""
        value = self.kwargs["pk"]
        queryset = self.filter_queryset(self.get_queryset())
        obj = None
        if value.isdigit():  # a numeric id wins over a purely numeric slug
            obj = queryset.filter(pk=int(value)).first()
        if obj is None:
            obj = queryset.filter(slug=value).first()
        if obj is None:
            raise Http404
        self.check_object_permissions(self.request, obj)
        return obj


class SkillViewSet(ContentViewSet):
    queryset = Skill.objects.all()
    serializer_class = s.SkillSerializer


class ExperienceViewSet(ContentViewSet):
    queryset = Experience.objects.all()
    serializer_class = s.ExperienceSerializer


class EducationViewSet(ContentViewSet):
    queryset = Education.objects.all()
    serializer_class = s.EducationSerializer


class CertificateViewSet(ContentViewSet):
    queryset = Certificate.objects.all()
    serializer_class = s.CertificateSerializer


class CourseViewSet(ContentViewSet):
    queryset = Course.objects.all()
    serializer_class = s.CourseSerializer


class QuoteViewSet(ContentViewSet):
    queryset = Quote.objects.all()
    serializer_class = s.QuoteSerializer


class GalleryViewSet(ContentViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = s.GallerySerializer


class WhatIDoViewSet(ContentViewSet):
    queryset = WhatIDo.objects.all()
    serializer_class = s.WhatIDoSerializer


class TestimonialViewSet(ContentViewSet):
    """Visitor testimonies with owner approval.

    * GET  /api/testimonials        public: approved only. Staff (Bearer token) see all,
                                    pending first, with ``isApproved``.
    * POST /api/testimonials        public, rate-limited. Always saved as *pending*.
    * PATCH|PUT /api/testimonials/<id>  staff: approve / unapprove / edit ({"isApproved": true}).
    * DELETE /api/testimonials/<id>     staff.
    """

    queryset = Testimonial.objects.all()
    serializer_class = s.TestimonialSerializer
    throttle_scope = "testimonial"

    def get_permissions(self):
        if self.action in ("list", "retrieve", "create"):
            return [AllowAny()]
        return [IsStaff()]

    def get_throttles(self):
        return [ScopedRateThrottle()] if self.action == "create" else []

    def get_serializer_class(self):
        return s.TestimonialSubmitSerializer if self.action == "create" else s.TestimonialSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if is_admin(self.request.user):
            return queryset.order_by("is_approved", "-created_at", "-id")  # pending first
        return queryset.filter(is_approved=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        testimonial = serializer.save(is_approved=False)
        notify_owner(
            f"New testimony from {testimonial.name} awaits approval",
            f"{testimonial.name} ({testimonial.role}) submitted a testimony:\n\n"
            f"{testimonial.text}\n\n"
            "Approve it in the dashboard (Testimonials tab) or in Django admin.",
        )
        return Response({"success": True, "status": "pending"}, status=201)


class SettingsView(APIView):
    """GET /api/settings (public, row auto-created) · PUT /api/settings (staff)."""

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        return [AllowAny()] if self.request.method == "GET" else [IsStaff()]

    def get(self, request):
        return Response(s.SiteSettingsSerializer(SiteSettings.load(), context={"request": request}).data)

    def put(self, request):
        serializer = s.SiteSettingsSerializer(
            SiteSettings.load(), data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True})
