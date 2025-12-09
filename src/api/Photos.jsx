import api from "./Client.jsx";

export const uploadPhotosApi = async (eventId, files) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("photos", file);
  }

  const res = await api.post(`/photos/events/${eventId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getEventPhotosApi = async (eventId) => {
  const res = await api.get(`/photos/events/${eventId}`);
  return res.data;
};
