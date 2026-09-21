from rest_framework import serializers

from apps.core.serializers import CamelCaseModelSerializer

from .models import ContactMessage


class ContactMessageSerializer(CamelCaseModelSerializer):
    """Body sent by the frontend: { name, email, message, projectType, budget }.
    ``subject`` is optional (the frontend form has no subject field)."""

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message", "project_type", "budget"]
        extra_kwargs = {
            "subject": {"required": False, "allow_blank": True},
            "project_type": {"required": False, "allow_blank": True},
            "budget": {"required": False, "allow_blank": True},
            "message": {"max_length": 5000},
        }

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("This field may not be blank.")
        return value

    def create(self, validated_data):
        if not validated_data.get("subject"):
            kind = validated_data.get("project_type") or "Portfolio"
            validated_data["subject"] = f"{kind} inquiry from {validated_data['name']}"[:255]
        return super().create(validated_data)
