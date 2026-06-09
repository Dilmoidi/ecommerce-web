import api from "./axios";

export const getMovies = (params) => api.get("/movies/", { params });

export const getMovie = (slug) => api.get(`/movies/${slug}/`);

export const getGenres = () => api.get("/movies/genres/");
