"""Movie & Genre API views."""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Genre, Movie
from .serializers import GenreSerializer, MovieDetailSerializer, MovieListSerializer


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "slug"


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.filter(is_active=True).prefetch_related("genres")
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["rating", "language", "genres__slug"]
    search_fields = ["title", "description"]
    ordering_fields = ["release_date", "average_rating", "title"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return MovieDetailSerializer
        return MovieListSerializer
