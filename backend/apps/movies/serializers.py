"""Movie & Genre serializers."""

from rest_framework import serializers

from .models import Genre, Movie


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name", "slug"]


class MovieListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "slug",
            "poster",
            "release_date",
            "duration_minutes",
            "rating",
            "average_rating",
            "genres",
            "language",
        ]


class MovieDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "poster",
            "trailer_url",
            "release_date",
            "duration_minutes",
            "rating",
            "average_rating",
            "genres",
            "language",
            "is_active",
            "created_at",
        ]
