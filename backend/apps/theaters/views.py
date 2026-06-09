"""Theater & Showtime API views."""

from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Screen, Seat, Showtime, Theater
from .serializers import (
    SeatSerializer,
    ShowtimeSerializer,
    TheaterDetailSerializer,
    TheaterListSerializer,
)


class TheaterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Theater.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["city", "state"]
    search_fields = ["name", "city"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TheaterDetailSerializer
        return TheaterListSerializer


class ShowtimeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ShowtimeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ["movie__slug", "screen__theater__slug"]

    def get_queryset(self):
        return (
            Showtime.objects.filter(is_active=True, start_time__gte=timezone.now())
            .select_related("movie", "screen__theater")
            .order_by("start_time")
        )

    @action(detail=True, methods=["get"])
    def seats(self, request, pk=None):
        showtime = self.get_object()
        seats = Seat.objects.filter(screen=showtime.screen, is_active=True)
        booked_seat_ids = set(
            showtime.bookings.exclude(status="cancelled").values_list(
                "booked_seats__seat_id", flat=True
            )
        )
        data = []
        for seat in seats:
            seat_data = SeatSerializer(seat).data
            seat_data["is_booked"] = seat.id in booked_seat_ids
            data.append(seat_data)
        return Response(data)
