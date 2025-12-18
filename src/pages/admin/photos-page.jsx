import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventApi } from "../../api/Events.jsx";
import {
  getUploadUrlApi,
  uploadToS3,
  getEventPhotosApi,
} from "../../api/Photos.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import toast from "react-hot-toast";

const PhotosPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const e = await getEventApi(eventId);
      setEvent(e);
      const p = await getEventPhotosApi(eventId);
      setPhotos(p);
    } catch {
      toastError("Failed to load event photos");
    }
  };

  useEffect(() => {
    load();
  }, [eventId]);

 const handleUpload = async (e) => {
  e.preventDefault();

  if (!files.length) {
    toastError("Select at least 1 file");
    return;
  }

  const t = toast.loading("Uploading...");
  setUploading(true);

  try {
    for (const file of files) {
      // 1️⃣ Get upload URL
      const { uploadUrl, key } = await getUploadUrlApi({
        eventId,
        filename: file.name,
        contentType: file.type,
      });

      // 2️⃣ Upload to S3
      await uploadToS3(uploadUrl, file);

      // 3️⃣ CONFIRM upload (🔥 REQUIRED)
      await confirmUploadApi({
        eventId,
        key,
      });
    }

    toast.dismiss(t);
    toastSuccess("Photos uploaded successfully!");
    await load(); // reload list
  } catch (err) {
    console.error(err);
    toast.dismiss(t);
    toastError("Upload failed");
  } finally {
    setUploading(false);
    setFiles([]);
  }
};

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Manage Photos</h1>
        {event && (
          <p className="text-sm text-slate-600">
            {event.name} • Gallery:{" "}
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
              {event.galleryCode}
            </span>
          </p>
        )}
      </header>

      <section className="bg-white border rounded-xl p-4">
        <form
          onSubmit={handleUpload}
          className="flex flex-col md:flex-row items-start gap-4"
        >
          <div>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
            />
            <p className="text-xs text-slate-500">Multiple files allowed</p>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-slate-900 text-white rounded"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </section>

      <section className="bg-white border rounded-xl p-4">
        <h2 className="text-lg font-medium">Photos ({photos.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {photos.map((p) => (
            <div key={p._id} className="p-2 border rounded bg-slate-50 text-xs">
              <div className="font-mono">{p._id}</div>
              <div className="text-slate-500">
                {p.width}×{p.height}
              </div>
            </div>
          ))}

          {!photos.length && (
            <p className="text-sm text-slate-500">No photos uploaded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PhotosPage;
