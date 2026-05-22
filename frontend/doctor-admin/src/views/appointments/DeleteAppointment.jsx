import React, { useEffect, useState } from "react";
import axios from "axios";
import AppointmentCard from "../../components/AppointmentCard";
import { specialties, doctorImages } from "../doctors/doctors_specialties";
import { doctorToSpecialty } from "../doctors/doctors_specialties";

const API = "http://localhost:8080/api/appointments";

// =========================
// DATE FORMAT FIX
// =========================
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.includes(".")) return dateStr;

  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}.`;
};

const DeleteAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [specialty, setSpecialty] = useState("ALL");

  // ✅ NEW STATUS FILTER
  const [status, setStatus] = useState("ALL");

  const [toast, setToast] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const token = localStorage.getItem("token");

  // =========================
  // LOAD
  // =========================
  const load = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data || []);
    } catch (err) {
      setToast("❌ Failed to load appointments");
      setTimeout(() => setToast(""), 3000);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // DELETE
  // =========================
  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToast("🗑 Appointment deleted");
      setTimeout(() => setToast(""), 3000);

      setConfirmId(null);
      load();
    } catch (err) {
      setToast("❌ Delete failed");
      setTimeout(() => setToast(""), 3000);
    }
  };

  // =========================
  // FILTERS
  // =========================
  const filtered = appointments.filter((a) => {
    const id = a.id || a._id;

    const textMatch =
      !search ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      String(id).toLowerCase().includes(search.toLowerCase());

    const dateMatch =
      !date || a.date === formatDate(date);

    

    const specialtyMatch =
      specialty === "ALL" ||
      doctorToSpecialty[a.doctorName] === specialty;

    // ✅ STATUS FILTER
    const statusMatch =
      status === "ALL" ||
      a.status === status;

    return (
      textMatch &&
      dateMatch &&
      specialtyMatch &&
      statusMatch
    );
  });

  return (
    <div style={page}>
      <h2>Delete Appointments</h2>

      {toast && (
        <div style={toastStyle}>
          {toast}
        </div>
      )}

      {/* FILTERS */}
      <div style={filterBar}>
        <input
          placeholder="Search doctor / patient / ID"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={input}
        />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          style={input}
        />

        {/* SPECIALTY */}
        <div style={{ display: "flex", gap: 5 }}>
          <select
            value={specialty}
            onChange={(e) =>
              setSpecialty(e.target.value)
            }
            style={input}
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              setSpecialty("ALL")
            }
            style={xBtn}
          >
            ✕
          </button>
        </div>

        {/* ✅ STATUS FILTER */}
        <div style={{ display: "flex", gap: 5 }}>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            style={input}
          >
            <option value="ALL">
              ALL STATUS
            </option>

            <option value="BOOKED">
              BOOKED
            </option>

            <option value="COMPLETED">
              COMPLETED
            </option>

            <option value="CANCELLED">
              CANCELLED
            </option>
          </select>

          <button
            onClick={() =>
              setStatus("ALL")
            }
            style={xBtn}
          >
            ✕
          </button>
        </div>
      </div>

      {/* NO RESULTS */}
      {filtered.length === 0 && (
        <div style={noData}>
          No appointments found
        </div>
      )}

      {/* CARDS */}
      <div style={grid}>
        {filtered.map((a) => {
          const id = a.id || a._id;

          return (
            <div key={id}>
              <AppointmentCard
                appt={a}
                onDelete={() =>
                  setConfirmId(id)
                }
              />

              {confirmId === id && (
                <div style={confirmBox}>
                  <p>
                    Delete this appointment?
                  </p>

                  <button
                    style={btnYes}
                    onClick={() =>
                      deleteAppointment(id)
                    }
                  >
                    YES
                  </button>

                  <button
                    style={btnNo}
                    onClick={() =>
                      setConfirmId(null)
                    }
                  >
                    NO
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeleteAppointment;

// =========================
// STYLES
// =========================

const page = { padding: 20 };

const filterBar = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 15,
};

const input = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
  minWidth: 200,
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 12,
};

const toastStyle = {
  background: "#ef4444",
  color: "#fff",
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
};

const confirmBox = {
  background: "#fff",
  padding: 10,
  borderRadius: 10,
  marginTop: 5,
  textAlign: "center",
};

const btnYes = {
  background: "green",
  color: "#fff",
  border: "none",
  padding: 8,
  marginRight: 5,
  borderRadius: 6,
};

const btnNo = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 6,
};

const xBtn = {
  padding: 10,
  borderRadius: 10,
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
};

const noData = {
  textAlign: "center",
  marginTop: 20,
  color: "gray",
};