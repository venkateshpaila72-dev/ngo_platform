import axiosClient from './axiosClient';

export const getImpactGallery = async (limit = 20) => {
  const res = await axiosClient.get('/public/impact-gallery', { params: { limit } });
  return res.data;
};

export const getNgoDirectory = async () => {
  const res = await axiosClient.get('/public/ngo-directory');
  return res.data;
};