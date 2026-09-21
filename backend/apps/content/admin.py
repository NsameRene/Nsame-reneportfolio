from django.contrib import admin

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

IMAGE_FIELDSET = ("Image", {"fields": ("image", "image_url"), "description": "Upload a file, or paste an external URL."})


class OrderedAdmin(admin.ModelAdmin):
    """Lets the owner set the manual order right in the list view."""

    list_editable = ("order",)
    ordering = ("order", "id")
    save_on_top = True


@admin.register(Project)
class ProjectAdmin(OrderedAdmin):
    list_display = ("title", "category", "featured", "technologies", "order", "created_at")
    list_editable = ("featured", "order")
    list_filter = ("featured", "category")
    search_fields = ("title", "description", "technologies", "category")
    readonly_fields = ("created_at",)
    fieldsets = (
        (None, {"fields": ("title", "description", "category", "technologies", "featured", "order")}),
        IMAGE_FIELDSET,
        ("Links", {"fields": ("github_link", "live_demo_link")}),
        ("Meta", {"fields": ("created_at",)}),
    )


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "category", "published_at", "reading_time")
    list_filter = ("category", "published_at")
    search_fields = ("title", "slug", "content", "tags", "category")
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "published_at"
    ordering = ("-published_at", "-id")
    save_on_top = True
    fieldsets = (
        (None, {"fields": ("title", "slug", "category", "tags", "published_at", "reading_time")}),
        ("Cover image", {"fields": ("image", "cover_image"), "description": "Upload a file, or paste an external URL."}),
        ("Content", {"fields": ("content",)}),
    )


@admin.register(Skill)
class SkillAdmin(OrderedAdmin):
    list_display = ("name", "category", "proficiency", "order")
    list_editable = ("proficiency", "order")
    list_filter = ("category",)
    search_fields = ("name", "category")
    ordering = ("category", "order", "id")


@admin.register(Experience)
class ExperienceAdmin(OrderedAdmin):
    list_display = ("role", "company", "start_date", "end_date", "order")
    search_fields = ("role", "company", "description")


@admin.register(Education)
class EducationAdmin(OrderedAdmin):
    list_display = ("degree", "institution", "start_date", "end_date", "order")
    search_fields = ("degree", "institution", "description")


@admin.register(Certificate)
class CertificateAdmin(OrderedAdmin):
    list_display = ("name", "issuer", "date", "order")
    list_filter = ("issuer",)
    search_fields = ("name", "issuer")


@admin.register(Course)
class CourseAdmin(OrderedAdmin):
    list_display = ("title", "link", "order")
    search_fields = ("title", "description")
    fieldsets = (
        (None, {"fields": ("title", "description", "link", "order")}),
        IMAGE_FIELDSET,
    )


@admin.register(Quote)
class QuoteAdmin(OrderedAdmin):
    list_display = ("author", "short_text", "order")
    search_fields = ("author", "text")

    @admin.display(description="Quote")
    def short_text(self, obj):
        return obj.text if len(obj.text) <= 80 else obj.text[:77] + "…"


@admin.register(GalleryItem)
class GalleryItemAdmin(OrderedAdmin):
    list_display = ("title", "image", "image_url", "order", "created_at")
    search_fields = ("title",)
    readonly_fields = ("created_at",)
    fieldsets = (
        (None, {"fields": ("title", "order")}),
        IMAGE_FIELDSET,
        ("Meta", {"fields": ("created_at",)}),
    )


@admin.register(WhatIDo)
class WhatIDoAdmin(OrderedAdmin):
    list_display = ("title", "icon", "items", "order")
    search_fields = ("title", "items")


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Single-row profile used by the Home and CV pages."""

    fieldsets = (
        ("Personal info", {"fields": ("name", "email", "phone", "location", "website", "bio")}),
        ("Profile image", {"fields": ("profile_image", "profile_image_url")}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    """Moderation queue for visitor testimonies. Pending ones are listed first;
    tick "approved" (or use the bulk action) to publish."""

    list_display = ("name", "role", "short_text", "is_approved", "created_at")
    list_display_links = ("name",)
    list_editable = ("is_approved",)
    list_filter = ("is_approved", "created_at")
    search_fields = ("name", "role", "text")
    date_hierarchy = "created_at"
    ordering = ("is_approved", "-created_at")  # pending first
    actions = ["approve", "unapprove"]
    readonly_fields = ("created_at",)
    fieldsets = (
        (None, {"fields": ("name", "role", "text")}),
        ("Moderation", {"fields": ("is_approved", "created_at")}),
    )

    @admin.display(description="Testimony")
    def short_text(self, obj):
        return obj.text if len(obj.text) <= 80 else obj.text[:77] + "..."

    @admin.action(description="Approve selected testimonies (publish)")
    def approve(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} testimony(ies) approved.")

    @admin.action(description="Unapprove selected testimonies (hide)")
    def unapprove(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f"{updated} testimony(ies) hidden.")
