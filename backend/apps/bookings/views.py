"""Booking API views."""

from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Booking
from .serializers import (
    BookingDetailSerializer,
    BookingListSerializer,
    CreateBookingSerializer,
)


class BookingViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects.filter(user=self.request.user)
            .select_related("showtime__movie", "showtime__screen__theater")
            .prefetch_related("booked_seats__seat")
        )

    def get_serializer_class(self):
        if self.action == "create":
            return CreateBookingSerializer
        if self.action == "retrieve":
            return BookingDetailSerializer
        return BookingListSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(
            BookingDetailSerializer(booking).data, status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == Booking.Status.CANCELLED:
            return Response(
                {"detail": "Booking is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if booking.status != Booking.Status.CONFIRMED:
            return Response(
                {"detail": "Only confirmed bookings can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        booking.status = Booking.Status.CANCELLED
        booking.save()
        return Response(
            BookingDetailSerializer(booking).data, status=status.HTTP_200_OK
        )
