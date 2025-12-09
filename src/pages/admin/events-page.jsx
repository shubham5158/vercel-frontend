import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createEventApi,
  getEventsApi,
  updateEventApi,
  deleteEventApi,
} from "../../api/Events.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    clientName: "",
    clientEmail: "",
    eventDate: "",
    location: "",
    basePricePerPhoto: 50,
    expiresAt: "",
  });

  const [editEvent, setEditEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

  const loadEvents = async () => {
    try {
      setLoadingList(true);
      const data = await getEventsApi();
      setEvents(data);
    } catch (err) {
      toastError("Failed to load events");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await createEventApi({
        ...form,
        basePricePerPhoto: Number(form.basePricePerPhoto),
      });

      toastSuccess("Event created successfully!");

      setForm({
        name: "",
        clientName: "",
        clientEmail: "",
        eventDate: "",
        location: "",
        basePricePerPhoto: 50,
        expiresAt: "",
      });

      await loadEvents();
    } catch (err) {
      toastError("Event creation failed");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      await updateEventApi(editEvent._id, editEvent);
      toastSuccess("Event updated successfully!");
      setEditEvent(null);
      await loadEvents();
    } catch (err) {
      toastError("Update failed");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEventApi(deleteEvent._id);
      toastSuccess("Event deleted!");
      setDeleteEvent(null);
      await loadEvents();
    } catch (err) {
      toastError("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Events</h1>
        <p className="text-sm text-slate-600">
          Create and manage client galleries for weddings and shoots.
        </p>
      </header>

      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4">Create New Event</h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <input
            name="name"
            placeholder="Event Name"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="clientName"
            placeholder="Client Name"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={form.clientName}
            onChange={handleChange}
          />

          <input
            name="clientEmail"
            placeholder="Client Email"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={form.clientEmail}
            onChange={handleChange}
          />

          <input
            type="date"
            name="eventDate"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={form.eventDate}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={form.location}
            onChange={handleChange}
          />

          <input
            type="number"
            name="basePricePerPhoto"
            placeholder="Base Price per Photo"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={form.basePricePerPhoto}
            onChange={handleChange}
          />

          <div className="md:col-span-2 flex items-center gap-4">
            <input
              type="date"
              name="expiresAt"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
              value={form.expiresAt}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Existing Events</h2>
          {loadingList && (
            <span className="text-xs text-slate-500">Loading...</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-700">
                <th className="px-3 py-2 text-left">Event</th>
                <th className="px-3 py-2 text-left">Client</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Gallery Code</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e._id} className="border-b">
                  <td className="px-3 py-2">{e.name}</td>
                  <td className="px-3 py-2">{e.clientName}</td>
                  <td className="px-3 py-2">
                    {e.eventDate ? e.eventDate.slice(0, 10) : "-"}
                  </td>
                  <td className="px-3 py-2 font-mono">{e.galleryCode}</td>

                  <td className="px-3 py-2 space-x-3">
                    <Link
                      to={`/admin/events/${e._id}/photos`}
                      className="text-xs text-slate-900 underline"
                    >
                      Photos
                    </Link>

                    <Link
                      to={`/admin/client-link/${e.galleryCode}`}
                      className="text-xs text-blue-600 underline"
                    >
                      QR Link
                    </Link>

                    <button
                      onClick={() => setEditEvent(e)}
                      className="text-xs text-green-600 underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteEvent(e)}
                      className="text-xs text-red-600 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!events.length && !loadingList && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-slate-500 py-4"
                  >
                    No events created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editEvent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900">
              Edit Event
            </h2>

            <input
              className="border w-full px-3 py-2 rounded mb-3"
              placeholder="Event Name"
              value={editEvent.name}
              onChange={(e) =>
                setEditEvent({ ...editEvent, name: e.target.value })
              }
            />

            <input
              className="border w-full px-3 py-2 rounded mb-3"
              placeholder="Client Name"
              value={editEvent.clientName}
              onChange={(e) =>
                setEditEvent({ ...editEvent, clientName: e.target.value })
              }
            />

            <input
              className="border w-full px-3 py-2 rounded mb-3"
              placeholder="Client Email"
              value={editEvent.clientEmail}
              onChange={(e) =>
                setEditEvent({ ...editEvent, clientEmail: e.target.value })
              }
            />

            <input
              type="date"
              className="border w-full px-3 py-2 rounded mb-3"
              value={editEvent.eventDate?.slice(0, 10)}
              onChange={(e) =>
                setEditEvent({ ...editEvent, eventDate: e.target.value })
              }
            />

            <input
              className="border w-full px-3 py-2 rounded mb-3"
              placeholder="Location"
              value={editEvent.location}
              onChange={(e) =>
                setEditEvent({ ...editEvent, location: e.target.value })
              }
            />

            <input
              type="number"
              className="border w-full px-3 py-2 rounded mb-3"
              placeholder="Base Price"
              value={editEvent.basePricePerPhoto}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  basePricePerPhoto: Number(e.target.value),
                })
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditEvent(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateEvent}
                className="px-4 py-2 bg-slate-900 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteEvent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-3">
              Delete Event?
            </h2>

            <p className="text-sm text-slate-700 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteEvent(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
