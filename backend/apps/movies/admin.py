from django.contrib import admin

from .models import Genre, Movie


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ["title", "release_date", "rating", "duration_minutes", "is_active"]
    list_filter = ["rating", "is_active", "genres"]
    search_fields = ["title"]
    prepopulated_fields = {"slug": ("title",)}
