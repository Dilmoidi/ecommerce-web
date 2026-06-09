"""Booking serializers with seat-level detail."""

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.theaters.models import Seat, Showtime

from .models import BookedSeat, Booking


class BookedSeatSerializer(serializers.ModelSerializer):
    row = serializers.CharField(source="seat.row", read_only=True)
    number = serializers.IntegerField(source="seat.number", read_only=True)
    seat_type = serializers.CharField(source="seat.seat_type", read_only=True)

    class Meta:
        model = BookedSeat
        fields = ["id", "seat", "row", "number", "seat_type", "price"]
        read_only_fields = ["price"]


class BookingListSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source="showtime.movie.title", read_only=True)
    theater_name = serializers.CharField(
        source="showtime.screen.theater.name", read_only=True
    )
    start_time = serializers.DateTimeField(source="showtime.start_time", read_only=True)
    seat_count = serializers.IntegerField(source="booked_seats.count", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "movie_title",
            "theater_name",
            "start_time",
            "status",
            "total_amount",
            "seat_count",
            "booking_date",
        ]


class BookingDetailSerializer(serializers.ModelSerializer):
    booked_seats = BookedSeatSerializer(many=True, read_only=True)
    movie_title = serializers.CharField(source="showtime.movie.title", read_only=True)
    theater_name = serializers.CharField(
        source="showtime.screen.theater.name", read_only=True
    )
    screen_name = serializers.CharField(source="showtime.screen.name", read_only=True)
    start_time = serializers.DateTimeField(source="showtime.start_time", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "movie_title",
            "theater_name",
            "screen_name",
            "start_time",
            "status",
            "total_amount",
            "booked_seats",
            "booking_date",
        ]


class CreateBookingSerializer(serializers.Serializer):
    showtime_id = serializers.IntegerField()
    seat_ids = serializers.ListField(
        child=serializers.IntegerField(), min_length=1, max_length=10
    )

    def validate_showtime_id(self, value):
        try:
            showtime = Showtime.objects.get(pk=value, is_active=True)
        except Showtime.DoesNotExist:
            raise serializers.ValidationError("Showtime not found or inactive.")
        if showtime.start_time <= timezone.now():
            raise serializers.ValidationError("Cannot book a showtime that has already started.")
        return value

    def validate_seat_ids(self, value):
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate seat IDs are not allowed.")
        return value

    def validate(self, attrs):
        showtime = Showtime.objects.get(pk=attrs["showtime_id"])
        seats = Seat.objects.filter(
            pk__in=attrs["seat_ids"], screen=showtime.screen, is_active=True
        )
        if seats.count() != len(attrs["seat_ids"]):
            raise serializers.ValidationError(
                {"seat_ids": "One or more seats are invalid for this showtime's screen."}
            )

        booked_seat_ids = set(
            BookedSeat.objects.filter(
                seat_id__in=attrs["seat_ids"],
                booking__showtime=showtime,
            )
            .exclude(booking__status="cancelled")
            .values_list("seat_id", flat=True)
        )
        if booked_seat_ids:
            raise serializers.ValidationError(
                {"seat_ids": f"Seats already booked: {list(booked_seat_ids)}"}
            )

        attrs["showtime"] = showtime
        attrs["seats"] = seats
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        showtime = validated_data["showtime"]
        seats = validated_data["seats"]
        user = self.context["request"].user

        booking = Booking.objects.create(user=user, showtime=showtime)

        total = 0
        for seat in seats:
            price_map = {
                "regular": showtime.price_regular,
                "premium": showtime.price_premium,
                "vip": showtime.price_vip,
            }
            price = price_map.get(seat.seat_type, showtime.price_regular)
            BookedSeat.objects.create(booking=booking, seat=seat, price=price)
            total += price

        booking.total_amount = total
        booking.status = Booking.Status.CONFIRMED
        booking.save()
        return booking
