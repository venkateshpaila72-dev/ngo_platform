import axiosClient from './axiosClient';

export const getMatches = async (needId, topN = 5) => {
  const res = await axiosClient.get(`/match/${needId}`, { params: { top_n: topN } });
  return res.data;
};

export const assignNgosToNeed = async (needId, ngoIds) => {
  const res = await axiosClient.post(`/match/${needId}/assign`, { ngo_ids: ngoIds });
  return res.data;
};