"""Movie-related models."""

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Genre(models.Model):
    """Movie genre (e.g. Action, Comedy, Drama)."""

    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Movie(models.Model):
    """A movie that can be booked."""

    class Rating(models.TextChoices):
        G = "G", "G"
        PG = "PG", "PG"
        PG13 = "PG-13", "PG-13"
        R = "R", "R"
        NC17 = "NC-17", "NC-17"

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    duration_minutes = models.PositiveIntegerField(
        help_text="Runtime in minutes",
        validators=[MinValueValidator(1)],
    )
    release_date = models.DateField()
    rating = models.CharField(max_length=5, choices=Rating.choices, default=Rating.PG13)
    genres = models.ManyToManyField(Genre, related_name="movies")
    poster = models.ImageField(upload_to="posters/", null=True, blank=True)
    trailer_url = models.URLField(blank=True)
    language = models.CharField(max_length=30, default="English")
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-release_date"]

    def __str__(self):
        return self.title
