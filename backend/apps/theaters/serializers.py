"""Theater, Screen, Seat, and Showtime serializers."""

from rest_framework import serializers

from .models import Screen, Seat, Showtime, Theater


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ["id", "row", "number", "seat_type", "is_active"]


class ScreenSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Screen
        fields = ["id", "name", "screen_type", "total_seats", "seats"]


class TheaterListSerializer(serializers.ModelSerializer):
    screen_count = serializers.IntegerField(source="screens.count", read_only=True)

    class Meta:
        model = Theater
        fields = [
            "id",
            "name",
            "slug",
            "city",
            "state",
            "screen_count",
        ]


class TheaterDetailSerializer(serializers.ModelSerializer):
    screens = ScreenSerializer(many=True, read_only=True)

    class Meta:
        model = Theater
        fields = [
            "id",
            "name",
            "slug",
            "address",
            "city",
            "state",
            "zip_code",
            "phone",
            "screens",
        ]


class ShowtimeSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source="movie.title", read_only=True)
    theater_name = serializers.CharField(source="screen.theater.name", read_only=True)
    screen_name = serializers.CharField(source="screen.name", read_only=True)
    screen_type = serializers.CharField(source="screen.screen_type", read_only=True)
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = Showtime
        fields = [
            "id",
            "movie_title",
            "theater_name",
            "screen_name",
            "screen_type",
            "start_time",
            "end_time",
            "price_regular",
            "price_premium",
            "price_vip",
            "available_seats",
        ]

    def get_available_seats(self, obj):
        total = obj.screen.seats.filter(is_active=True).count()
        booked = obj.bookings.exclude(status="cancelled").values_list(
            "booked_seats__seat_id", flat=True
        )
        return total - len([s for s in booked if s is not None])
