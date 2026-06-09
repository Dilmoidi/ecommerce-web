"""Movie URL patterns."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("genres", views.GenreViewSet, basename="genre")
router.register("", views.MovieViewSet, basename="movie")

app_name = "movies"

urlpatterns = [
    path("", include(router.urls)),
]
