import axiosClient from './axiosClient';

export const registerNgo = async (payload) => {
  const res = await axiosClient.post('/ngos', payload);
  return res.data;
};

export const loginNgo = async (contactEmail, password) => {
  const res = await axiosClient.post('/ngos/login', {
    contact_email: contactEmail,
    password,
  });
  return res.data;
};

export const listNgos = async () => {
  const res = await axiosClient.get('/ngos');
  return res.data;
};

export const getNgo = async (ngoId) => {
  const res = await axiosClient.get(`/ngos/${ngoId}`);
  return res.data;
};

export const updateAvailability = async (ngoId, activeCapacity) => {
  const res = await axiosClient.patch(`/ngos/${ngoId}/availability`, {
    active_capacity: activeCapacity,
  });
  return res.data;
};

export const getTasksForNgo = async (ngoId, activeOnly = false) => {
  const res = await axiosClient.get(`/ngos/${ngoId}/tasks`, {
    params: { active_only: activeOnly },
  });
  return res.data;
};