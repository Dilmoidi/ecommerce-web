"""Booking / reservation models."""

import uuid

from django.conf import settings
from django.db import models


class Booking(models.Model):
    """A ticket booking made by a user."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        EXPIRED = "expired", "Expired"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings"
    )
    showtime = models.ForeignKey(
        "theaters.Showtime", on_delete=models.CASCADE, related_name="bookings"
    )
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PENDING
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    booking_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-booking_date"]

    def __str__(self):
        return f"Booking {self.id} — {self.user.email}"


class BookedSeat(models.Model):
    """A specific seat reserved within a booking."""

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="booked_seats")
    seat = models.ForeignKey(
        "theaters.Seat", on_delete=models.CASCADE, related_name="booked_seats"
    )
    price = models.DecimalField(max_digits=8, decimal_places=2)

    class Meta:
        unique_together = ("booking", "seat")

    def __str__(self):
        return f"{self.seat} — Booking {self.booking_id}"
