from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """Inbox for contact-form submissions (read-only apart from the read flag)."""

    list_display = ("created_at", "name", "email", "subject", "project_type", "budget", "is_read")
    list_display_links = ("created_at", "name")
    list_editable = ("is_read",)
    list_filter = ("is_read", "project_type", "created_at")
    search_fields = ("name", "email", "subject", "message")
    date_hierarchy = "created_at"
    actions = ["mark_read", "mark_unread"]
    readonly_fields = ("name", "email", "subject", "message", "project_type", "budget", "created_at")
    fieldsets = (
        ("Sender", {"fields": ("name", "email", "created_at")}),
        ("Message", {"fields": ("subject", "project_type", "budget", "message")}),
        ("Status", {"fields": ("is_read",)}),
    )

    def has_add_permission(self, request):
        return False

    @admin.action(description="Mark selected messages as read")
    def mark_read(self, request, queryset):
        queryset.update(is_read=True)

    @admin.action(description="Mark selected messages as unread")
    def mark_unread(self, request, queryset):
        queryset.update(is_read=False)
