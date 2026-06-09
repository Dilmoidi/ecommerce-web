"""Theater, screen, seat, and showtime models."""

from django.core.validators import MinValueValidator
from django.db import models


class Theater(models.Model):
    """A cinema / multiplex venue."""

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    phone = models.CharField(max_length=15, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} — {self.city}"


class Screen(models.Model):
    """A screening room inside a theater."""

    class ScreenType(models.TextChoices):
        STANDARD = "standard", "Standard"
        IMAX = "imax", "IMAX"
        DOLBY = "dolby", "Dolby Atmos"
        THREE_D = "3d", "3D"

    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name="screens")
    name = models.CharField(max_length=50)
    screen_type = models.CharField(
        max_length=10, choices=ScreenType.choices, default=ScreenType.STANDARD
    )
    total_seats = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("theater", "name")
        ordering = ["theater", "name"]

    def __str__(self):
        return f"{self.theater.name} — {self.name}"


class Seat(models.Model):
    """An individual seat in a screen."""

    class SeatType(models.TextChoices):
        REGULAR = "regular", "Regular"
        PREMIUM = "premium", "Premium"
        VIP = "vip", "VIP"

    screen = models.ForeignKey(Screen, on_delete=models.CASCADE, related_name="seats")
    row = models.CharField(max_length=5)
    number = models.PositiveIntegerField()
    seat_type = models.CharField(
        max_length=10, choices=SeatType.choices, default=SeatType.REGULAR
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("screen", "row", "number")
        ordering = ["row", "number"]

    def __str__(self):
        return f"{self.row}{self.number} ({self.get_seat_type_display()})"


class Showtime(models.Model):
    """A specific screening of a movie on a screen at a given time."""

    movie = models.ForeignKey(
        "movies.Movie", on_delete=models.CASCADE, related_name="showtimes"
    )
    screen = models.ForeignKey(Screen, on_delete=models.CASCADE, related_name="showtimes")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    price_regular = models.DecimalField(max_digits=8, decimal_places=2)
    price_premium = models.DecimalField(max_digits=8, decimal_places=2)
    price_vip = models.DecimalField(max_digits=8, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["start_time"]

    def __str__(self):
        return f"{self.movie.title} @ {self.screen} — {self.start_time:%Y-%m-%d %H:%M}"
