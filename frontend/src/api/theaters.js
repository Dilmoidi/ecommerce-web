import api from "./axios";

export const getTheaters = (params) => api.get("/theaters/venues/", { params });

export const getTheater = (slug) => api.get(`/theaters/venues/${slug}/`);

export const getShowtimes = (params) => api.get("/theaters/showtimes/", { params });

export const getShowtimeSeats = (showtimeId) =>
  api.get(`/theaters/showtimes/${showtimeId}/seats/`);
