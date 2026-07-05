import axiosClient from './axiosClient';

// GET /tasks/{task_id}/chat -> { task_id, archived, messages: [...] }
export const getMessages = async (taskId) => {
  const res = await axiosClient.get(`/tasks/${taskId}/chat`);
  return res.data;
};

// POST /tasks/{task_id}/chat -> { id, task_id, sender_id, sender_type, text, created_at }
export const postMessage = async (taskId, senderId, senderType, text) => {
  const res = await axiosClient.post(`/tasks/${taskId}/chat`, {
    sender_id: senderId,
    sender_type: senderType,
    text,
  });
  return res.data;
};