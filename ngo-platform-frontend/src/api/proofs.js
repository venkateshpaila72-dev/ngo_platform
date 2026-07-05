import axiosClient from './axiosClient';

export const submitProof = async ({
  taskId,
  ngoId,
  photoUrl,
  location,
  volunteerId,
  storyText,
  feedbackRating,
}) => {
  const res = await axiosClient.post('/proofs/submit', {
    task_id: taskId,
    ngo_id: ngoId,
    photo_url: photoUrl,
    location,
    volunteer_id: volunteerId,
    story_text: storyText,
    feedback_rating: feedbackRating,
  });
  return res.data;
};

export const verifyProof = async (proofId, approve) => {
  const res = await axiosClient.post(`/proofs/${proofId}/verify`, { approve });
  return res.data;
};

export const listProofs = async ({ status, ngoId } = {}) => {
  const params = {};
  if (status) params.status = status;
  if (ngoId) params.ngo_id = ngoId;
  const res = await axiosClient.get('/proofs', { params });
  return res.data;
};