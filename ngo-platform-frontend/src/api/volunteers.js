import axiosClient from './axiosClient';

export const registerVolunteer = async ({ ngoId, name, email, password }) => {
  const res = await axiosClient.post('/volunteers', {
    ngo_id: ngoId,
    name,
    email,
    password,
  });
  return res.data;
};

export const loginVolunteer = async (email, password) => {
  const res = await axiosClient.post('/volunteers/login', { email, password });
  return res.data;
};

export const listVolunteers = async (ngoId) => {
  const res = await axiosClient.get('/volunteers', {
    params: ngoId ? { ngo_id: ngoId } : {},
  });
  return res.data;
};