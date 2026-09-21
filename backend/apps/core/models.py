from django.db import models


class OrderedModel(models.Model):
    """Adds a manual ``order`` so the owner can arrange items in the admin.

    Items with the same order fall back to insertion order (id), which is the
    order the old Node API returned rows in.
    """

    order = models.PositiveIntegerField(
        default=0, db_index=True, help_text="Lower numbers appear first. Leave 0 to keep creation order."
    )

    class Meta:
        abstract = True
        ordering = ["order", "id"]
