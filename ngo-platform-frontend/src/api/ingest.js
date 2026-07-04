import axiosClient from './axiosClient';

export const ingestCsv = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  // Don't set Content-Type manually — axios detects FormData and lets the
  // browser generate the correct multipart boundary automatically. Setting
  // 'multipart/form-data' by hand here would omit that boundary and break
  // the upload.
  const res = await axiosClient.post('/ingest', formData);
  return res.data;
};