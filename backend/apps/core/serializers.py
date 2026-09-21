"""Serializer building blocks that keep the API identical to the old Node one:
camelCase JSON keys, and one ``*Url`` field that is either an uploaded file or
an external URL."""
import re

from rest_framework import serializers

from .validators import validate_link

_SNAKE_RE = re.compile(r"_([a-z0-9])")
_CAMEL_RE = re.compile(r"(?<!^)(?=[A-Z])")


def snake_to_camel(name):
    return _SNAKE_RE.sub(lambda m: m.group(1).upper(), name)


def camel_to_snake(name):
    return _CAMEL_RE.sub("_", name).lower()


class CamelCaseModelSerializer(serializers.ModelSerializer):
    """Declare fields in snake_case; JSON in/out is camelCase (``imageUrl``)."""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {snake_to_camel(key): value for key, value in data.items()}

    def to_internal_value(self, data):
        # QueryDict (multipart) and dict (JSON) both expose .items(); values
        # for file inputs are UploadedFile objects and pass straight through.
        mapped = {camel_to_snake(key): value for key, value in data.items()}
        return super().to_internal_value(mapped)


class MediaSerializer(CamelCaseModelSerializer):
    """For models with an uploaded ``file_field`` *and* an external ``url_field``.

    Output: ``<url_field>`` is the absolute URL of the uploaded file if there
    is one, otherwise the stored external URL (what the frontend renders).
    Input:
      * upload a file under ``file_field``  -> stored; external URL cleared
      * send a *different* ``<url_field>``   -> stored; any uploaded file cleared
      * echo back the current URL unchanged  -> ignored (the admin form does this)
    """

    file_field = "image"
    url_field = "image_url"

    def get_fields(self):
        fields = super().get_fields()
        fields[self.url_field] = serializers.CharField(
            required=False, allow_blank=True, allow_null=True, max_length=500, validators=[validate_link]
        )
        fields[self.file_field].write_only = True
        return fields

    def _current_url(self, instance):
        upload = getattr(instance, self.file_field)
        if upload:
            request = self.context.get("request")
            return request.build_absolute_uri(upload.url) if request else upload.url
        return getattr(instance, self.url_field) or ""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data[snake_to_camel(self.url_field)] = self._current_url(instance)
        return data

    def validate(self, attrs):
        attrs = super().validate(attrs)
        upload = attrs.get(self.file_field)
        if upload:
            attrs[self.url_field] = ""
        elif self.url_field in attrs:
            url = attrs[self.url_field] or ""
            if self.instance is not None and url == self._current_url(self.instance):
                attrs.pop(self.url_field)  # unchanged
            else:
                attrs[self.url_field] = url
                if self.instance is not None:
                    attrs[self.file_field] = ""  # external URL replaces the upload
        return attrs
