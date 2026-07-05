import axiosClient from './axiosClient';

export const splitAssignTask = async (needId, splits) => {
  const res = await axiosClient.post(`/tasks/${needId}/split-assign`, { splits });
  return res.data;
};

export const getTask = async (taskId) => {
  const res = await axiosClient.get(`/tasks/${taskId}`);
  return res.data;
};

export const listUnclaimedTasks = async () => {
  const res = await axiosClient.get('/tasks/unclaimed');
  return res.data;
};

export const dropSubtask = async (taskId, ngoId) => {
  const res = await axiosClient.post(`/tasks/${taskId}/subtask/${ngoId}/drop`);
  return res.data;
};

export const suggestReplacements = async (taskId, ngoId, topN = 5) => {
  const res = await axiosClient.get(
    `/tasks/${taskId}/subtask/${ngoId}/suggest-replacement`,
    { params: { top_n: topN } }
  );
  return res.data;
};

export const reassignSubtask = async (taskId, oldNgoId, newNgoId) => {
  const res = await axiosClient.post(`/tasks/${taskId}/subtask/${oldNgoId}/reassign`, {
    new_ngo_id: newNgoId,
  });
  return res.data;
};

export const completeSubtask = async (taskId, ngoId) => {
  const res = await axiosClient.post(`/tasks/${taskId}/subtask/${ngoId}/complete`);
  return res.data;
};

export const resolveTaskWithGap = async (taskId) => {
  const res = await axiosClient.post(`/tasks/${taskId}/resolve-with-gap`);
  return res.data;
};