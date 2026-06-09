from django.contrib import admin

from .models import Screen, Seat, Showtime, Theater


class ScreenInline(admin.TabularInline):
    model = Screen
    extra = 0


@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    list_display = ["name", "city", "state", "is_active"]
    list_filter = ["is_active", "city", "state"]
    search_fields = ["name", "city"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ScreenInline]


@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    list_display = ["name", "theater", "screen_type", "total_seats"]
    list_filter = ["screen_type"]


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ["screen", "row", "number", "seat_type", "is_active"]
    list_filter = ["seat_type", "is_active"]


@admin.register(Showtime)
class ShowtimeAdmin(admin.ModelAdmin):
    list_display = ["movie", "screen", "start_time", "end_time", "price_regular", "is_active"]
    list_filter = ["is_active", "screen__theater"]
    search_fields = ["movie__title"]
