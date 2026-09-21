from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

admin.site.site_header = "Nsame René Portfolio"
admin.site.site_title = "Portfolio admin"
admin.site.index_title = "Manage portfolio content"


def api_root(_request):
    # Same message the old Node server returned at "/".
    return JsonResponse({"message": "Portfolio API is running"})


urlpatterns = [
    path("", api_root),
    path(settings.ADMIN_URL, admin.site.urls),
    path("api/", include("apps.core.urls")),
    path("api/", include("apps.accounts.urls")),
    path("api/", include("apps.content.urls")),
    path("api/", include("apps.contact.urls")),
]

# In production /media/ is served by PythonAnywhere's static-files mapping.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
