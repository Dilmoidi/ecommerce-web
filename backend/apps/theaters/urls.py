"""Theater URL patterns."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("venues", views.TheaterViewSet, basename="theater")
router.register("showtimes", views.ShowtimeViewSet, basename="showtime")

app_name = "theaters"

urlpatterns = [
    path("", include(router.urls)),
]
