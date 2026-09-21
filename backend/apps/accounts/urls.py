from django.urls import path

from .views import CheckView, LoginView

urlpatterns = [
    path("auth/login", LoginView.as_view()),
    path("auth/check", CheckView.as_view()),
]
