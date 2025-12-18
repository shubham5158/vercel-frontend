import api from "./Client.jsx";

// 1️⃣ Get presigned URL
export const getUploadUrlApi = async ({
  eventId,
  filename,
  contentType,
}) => {
  const res = await api.post("/photos/upload-url", {
    eventId,
    filename,
    contentType,
  });
  return res.data;
};

// 2️⃣ Upload directly to S3
export const uploadToS3 = async (uploadUrl, file) => {
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
};

// 3️⃣ List photos
export const getEventPhotosApi = async (eventId) => {
  const res = await api.get(`/photos/events/${eventId}`);
  return res.data;
};
