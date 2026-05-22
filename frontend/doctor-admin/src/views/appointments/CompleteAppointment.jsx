import React, { useEffect, useState } from "react";
import axios from "axios";
import AppointmentCard from "../../components/AppointmentCard";
import { specialties } from "../doctors/doctors_specialties";
import { doctorToSpecialty } from "../doctors/doctors_specialties";

const API = "http://localhost:8080/api/appointments";

// =========================
// DATE FORMAT
// =========================
const formatDate = (dateStr) => {
  if (!dateStr) return "";

  if (dateStr.includes(".")) return dateStr;

  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}.`;
};

// =========================
// PAST APPOINTMENT CHECK
// =========================
const isPastAppointment = (dateStr, timeStr) => {
  try {
    if (!dateStr || !timeStr) return false;

    const parts = dateStr.split(".");

    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    const appointmentDate = new Date(
      `${year}-${month}-${day}T${timeStr}:00`
    );

    return appointmentDate < new Date();
  } catch {
    return false;
  }
};

const CompleteAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [specialty, setSpecialty] = useState("ALL");

  const [toast, setToast] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const token = localStorage.getItem("token");


  // =========================
  // LOAD
  // =========================
  const load = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // COMPLETE
  // =========================
  const completeAppointment = async (id) => {
    try {
      await axios.put(
        `${API}/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToast("✅ Appointment completed");
      setTimeout(() => setToast(""), 3000);

      setConfirmId(null);
      load();
    } catch (err) {
      console.log(err);

      setToast("❌ Complete failed");
      setTimeout(() => setToast(""), 3000);
    }
  };

  // =========================
  // FILTERS
  // =========================
  const filtered = appointments.filter((a) => {
    const id = a.id || a._id;

    // SEARCH
    const textMatch =
      !search ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      String(id).toLowerCase().includes(search.toLowerCase());

    // DATE
    const dateMatch =
      !date || a.date === formatDate(date);

    // SPECIALTY
    const specialtyMatch =
      specialty === "ALL" ||
      doctorToSpecialty[a.doctorName] === specialty;

    // ONLY ACTIVE
    const isActive = a.status === "BOOKED";

    return (
      textMatch &&
      dateMatch &&
      specialtyMatch &&
      isActive
    );
  });

  return (
    <div style={page}>
      <h2>Complete Appointments</h2>

      {toast && <div style={toastStyle}>{toast}</div>}

      {/* FILTERS */}
      <div style={filterBar}>
        <input
          placeholder="Search doctor / patient / ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={input}
        />

        {/* SPECIALTY */}
        <div style={{ display: "flex", gap: 5 }}>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={input}
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* RESET */}
          <button
            onClick={() => setSpecialty("ALL")}
            style={xBtn}
          >
            ✕
          </button>
        </div>
      </div>

      {/* NO DATA */}
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
                onComplete={() => setConfirmId(id)}
              />

              {/* CONFIRM */}
              {confirmId === id && (
                <div style={confirmBox}>
                  <p>Complete this appointment?</p>

                  <button
                    style={btnYes}
                    onClick={() => completeAppointment(id)}
                  >
                    YES
                  </button>

                  <button
                    style={btnNo}
                    onClick={() => setConfirmId(null)}
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

export default CompleteAppointment;

// =========================
// STYLES
// =========================

const page = {
  padding: 20,
};

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
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 12,
};

const toastStyle = {
  background: "#22c55e",
  color: "white",
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
  background: "#22c55e",
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