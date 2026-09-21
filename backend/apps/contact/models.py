from django.db import models


class ContactMessage(models.Model):
    """Message submitted through the public contact form."""

    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    subject = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    # Extra fields the frontend contact wizard collects (the Node API dropped them).
    project_type = models.CharField(max_length=100, blank=True)
    budget = models.CharField(max_length=100, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"{self.name}: {self.subject or self.message[:40]}"
