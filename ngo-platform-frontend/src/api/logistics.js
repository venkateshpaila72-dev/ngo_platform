import axiosClient from './axiosClient';

// POST /ngos/{ngo_id}/en-route
export const setEnRoute = async (ngoId, destination, etaMinutes) => {
  const res = await axiosClient.post(`/ngos/${ngoId}/en-route`, {
    destination,
    eta_minutes: etaMinutes,
  });
  return res.data;
};

// DELETE /ngos/{ngo_id}/en-route
export const clearEnRoute = async (ngoId) => {
  const res = await axiosClient.delete(`/ngos/${ngoId}/en-route`);
  return res.data;
};

// GET /logistics/synergy -> { count, alerts: [...] }
export const getSynergyAlerts = async () => {
  const res = await axiosClient.get('/logistics/synergy');
  return res.data;
};