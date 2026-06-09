from django.contrib import admin

from .models import BookedSeat, Booking


class BookedSeatInline(admin.TabularInline):
    model = BookedSeat
    extra = 0
    readonly_fields = ["seat", "price"]


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "showtime", "status", "total_amount", "booking_date"]
    list_filter = ["status"]
    search_fields = ["user__email", "id"]
    inlines = [BookedSeatInline]
    readonly_fields = ["id", "booking_date"]
