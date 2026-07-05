import axiosClient from './axiosClient';

export const generateStory = async (proofId) => {
  const res = await axiosClient.post(`/proofs/${proofId}/generate-story`);
  return res.data;
};