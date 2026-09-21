from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

# trailing_slash=False keeps the exact Express URLs: /api/projects, /api/projects/3
router = SimpleRouter(trailing_slash=False)
router.register("projects", views.ProjectViewSet, basename="project")
router.register("blogs", views.BlogViewSet, basename="blog")
router.register("skills", views.SkillViewSet, basename="skill")
router.register("experiences", views.ExperienceViewSet, basename="experience")
router.register("education", views.EducationViewSet, basename="education")
router.register("certificates", views.CertificateViewSet, basename="certificate")
router.register("courses", views.CourseViewSet, basename="course")
router.register("quotes", views.QuoteViewSet, basename="quote")
router.register("gallery", views.GalleryViewSet, basename="gallery")
router.register("testimonials", views.TestimonialViewSet, basename="testimonial")
router.register("what_i_do", views.WhatIDoViewSet, basename="what-i-do")

urlpatterns = [path("settings", views.SettingsView.as_view()), *router.urls]
