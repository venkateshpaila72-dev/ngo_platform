import axiosClient from './axiosClient';

// POST /events -> { id, name, location, radius_km, active, description }
export const createEvent = async ({ name, location, radiusKm = 10, description }) => {
  const res = await axiosClient.post('/events', {
    name,
    location,
    radius_km: radiusKm,
    description: description || null,
  });
  return res.data;
};

// GET /events?active_only=bool
export const listEvents = async (activeOnly = false) => {
  const res = await axiosClient.get('/events', { params: { active_only: activeOnly } });
  return res.data;
};

// PATCH /events/{id}/active
export const setEventActive = async (eventId, active) => {
  const res = await axiosClient.patch(`/events/${eventId}/active`, { active });
  return res.data;
};

// GET /events/{id}/needs -> needs scoped to the event's venue radius
export const getEventNeeds = async (eventId) => {
  const res = await axiosClient.get(`/events/${eventId}/needs`);
  return res.data;
};

// GET /events/{id}/clusters -> clusters scoped to the event's venue radius
export const getEventClusters = async (eventId) => {
  const res = await axiosClient.get(`/events/${eventId}/clusters`);
  return res.data;
};