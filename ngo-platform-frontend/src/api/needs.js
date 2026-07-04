import axiosClient from './axiosClient';

export const listNeeds = async ({ status, needType } = {}) => {
  const params = {};
  if (status) params.status = status;
  if (needType) params.need_type = needType;
  const res = await axiosClient.get('/needs', { params });
  return res.data;
};

export const getNeed = async (needId) => {
  const res = await axiosClient.get(`/needs/${needId}`);
  return res.data;
};