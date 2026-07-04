import axiosClient from './axiosClient';

export const getClusters = async () => {
  const res = await axiosClient.get('/clusters');
  return res.data;
};