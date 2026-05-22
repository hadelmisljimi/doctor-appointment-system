import React, { useEffect, useState } from "react";
import axios from "axios";
import { specialties, doctorImages } from "../doctors/doctors_specialties";

const generateSlots = () => {
  const slots = [];

  for (let h = 8; h <= 21; h++) {
    const hour = h < 10 ? `0${h}` : `${h}`;

    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }

  return slots;
};

const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.split(" ");

  return (
    (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase()
  );
};

const formatDateToBackend = (dateStr) => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-");

  return `${day}.${month}.${year}.`;
};

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [openDoctor, setOpenDoctor] = useState(false);
  const [openPatient, setOpenPatient] = useState(false);

  const [specialty, setSpecialty] = useState("ALL");

  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pastError, setPastError] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [docRes, patRes, appRes] =
        await Promise.all([
          axios.get("http://localhost:8080/api/doctors"),
          axios.get("http://localhost:8080/api/patients"),
          axios.get("http://localhost:8080/api/appointments"),
        ]);

      setDoctors(docRes.data || []);
      setPatients(patRes.data || []);
      setAppointments(appRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FILTER DOCTORS BY SPECIALTY
  const filteredDoctors =
    specialty === "ALL"
      ? doctors
      : doctors.filter(
          (d) => d.specialization === specialty
        );

  // ✅ CHECK IF SLOT IS TAKEN
  const isTaken = (d, t) =>
    appointments.some(
      (a) =>
        a.date === d &&
        a.time === t &&
        a.status === "BOOKED"
    );

  const slots = generateSlots();

  const isPastDateTime = (
    selectedDate,
    selectedTime
  ) => {
    if (!selectedDate || !selectedTime)
      return false;

    const now = new Date();

    const [year, month, day] =
      selectedDate.split("-");

    const [hours, minutes] =
      selectedTime.split(":");

    const selected = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes
    );

    return selected < now;
  };

  const validate = () => {
    if (
      !doctor ||
      !patient ||
      !date ||
      !time
    ) {
      setError(
        "❌ You must fill all fields!"
      );

      return false;
    }

    return true;
  };

  const handleConfirm = async () => {
    setError("");
    setSuccess("");

    if (!validate()) return;

    if (isPastDateTime(date, time)) {
      setError(
        "❌ You must choose future date and time!"
      );

      return;
    }

    if (
      isTaken(
        formatDateToBackend(date),
        time
      )
    ) {
      setError(
        "❌ This slot is already taken!"
      );

      return;
    }

    try {
      const payload = {
        doctorId: doctor.id,
        patientId: patient.id,
        date: formatDateToBackend(date),
        time: time,
      };

      console.log("SENDING:", payload);

      await axios.post(
        "http://localhost:8080/api/appointments",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      setSuccess(
        "✅ Appointment successfully booked!"
      );

      setDoctor(null);
      setPatient(null);
      setDate("");
      setTime("");

      loadData();

    } catch (e) {

      console.log(
        "FULL ERROR:",
        e.response
      );

      const backendMessage =
        e.response?.data?.message ||
        e.response?.data?.error ||
        JSON.stringify(e.response?.data) ||
        "Server error";

      setError(`❌ ${backendMessage}`);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>
        Book Appointment
      </h2>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {success && (
        <div style={styles.success}>
          {success}
        </div>
      )}

      <div style={styles.grid}>

        {/* DOCTOR */}
        <div style={styles.card}>

          <h3>Doctor</h3>

          <label style={styles.label}>
            Specialty
          </label>

          <select
            style={styles.input}
            value={specialty}
            onChange={(e) =>
              setSpecialty(e.target.value)
            }
          >
            {specialties.map((s) => (
              <option
                key={s}
                value={s}
              >
                {s}
              </option>
            ))}
          </select>

          <label style={styles.label}>
            Select Doctor
          </label>

          <div style={styles.dropdown}>

            <div
              style={styles.selectedBox}
              onClick={() =>
                setOpenDoctor(!openDoctor)
              }
            >
              {doctor
                ? doctor.name
                : "Click to select doctor"}
            </div>

            {openDoctor && (
              <div style={styles.dropdownList}>

                {filteredDoctors.map((d, index) => (

                  <div
                    key={d.id || index}
                    style={{
                      ...styles.item,
                      background:
                        doctor?.id === d.id
                          ? "#e0ecff"
                          : "white",
                    }}
                    onClick={() => {
                      setDoctor(d);
                      setOpenDoctor(false);
                    }}
                  >

                    <img
                      src={
                        doctorImages[d.name] ||
                        "/images/doctors/default.jpg"
                      }
                      style={styles.avatar}
                      alt={d.name}
                    />

                    <div>
                      <b>{d.name}</b>

                      <div
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        {d.specialization}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PATIENT */}
        <div style={styles.card}>

          <h3>Patient</h3>

          <p
            style={{
              color: token
                ? "green"
                : "red",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {token
              ? `Logged in as ${role}`
              : "Login required to book"}

          </p>

          <p style={{ fontSize: "12px" }}>
            “If your name does not appear here, you need to go to the Patients section and add a patient.”
          </p>

          <label style={styles.label}>
            Select Patient
          </label>

          <div style={styles.dropdown}>

            <div
              style={styles.selectedBox}
              onClick={() =>
                setOpenPatient(!openPatient)
              }
            >
              {patient
                ? patient.name
                : "Click to select patient"}
            </div>

            {openPatient && (
              <div style={styles.dropdownList}>

                {patients.map((p, index) => (

                  <div
                    key={p.id || index}
                    style={{
                      ...styles.item,
                      background:
                        patient?.id === p.id
                          ? "#e0ecff"
                          : "white",
                    }}
                    onClick={() => {
                      setPatient(p);
                      setOpenPatient(false);
                    }}
                  >

                    <div style={styles.circle}>
                      {getInitials(p.name)}
                    </div>

                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DATE TIME */}
        <div style={styles.card}>

          <h3>Date & Time</h3>

          <label style={styles.label}>
            Date
          </label>

          <input
            type="date"
            style={styles.input}
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <label style={styles.label}>
            Time
          </label>

          <div style={styles.timeGrid}>

            {slots.map((t) => {

              const disabled =
                isTaken(
                  formatDateToBackend(date),
                  t
                ) ||
                isPastDateTime(date, t);

              return (
                <button
                  key={t}
                  onClick={() => {

                    if (
                      disabled
                    ) return;

                    setTime(t);
                  }}
                  style={{
                    ...styles.time,

                    background:
                      time === t
                        ? "#2563eb"
                        : disabled
                        ? "#ccc"
                        : "#f1f5f9",

                    color:
                      disabled
                        ? "#777"
                        : "#000",

                    cursor:
                      disabled
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {pastError && (
            <div style={styles.errText}>
              {pastError}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 15,
        }}
      >
        <button
          onClick={handleConfirm}
          style={styles.confirm}
        >
          CONFIRM APPOINTMENT
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: 20,
    background: "#f5f9ff",
    minHeight: "100vh",
  },

  title: {
    textAlign: "center",
    marginBottom: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr 1fr",
    gap: 12,
  },

  card: {
    background: "white",
    borderRadius: 14,
    padding: 12,
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.05)",
    height: 420,
    overflow: "hidden",
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 6,
  },

  input: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginBottom: 8,
  },

  dropdown: {
    position: "relative",
  },

  selectedBox: {
    background: "#fafafa",
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 8,
    cursor: "pointer",
  },

  dropdownList: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    maxHeight: 200,
    overflowY: "auto",
    background: "white",
    border: "1px solid #ddd",
    zIndex: 10,
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 8,
    cursor: "pointer",
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    objectFit: "cover",
  },

  circle: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  timeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 5,
    maxHeight: 250,
    overflowY: "auto",
  },

  time: {
    padding: 6,
    border: "none",
    borderRadius: 6,
  },

  confirm: {
    padding: "12px 30px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    background: "#ef4444",
    color: "white",
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  },

  success: {
    background: "#22c55e",
    color: "white",
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  },

  errText: {
    color: "red",
    fontSize: 11,
    marginTop: 4,
  },
};

export default BookAppointment;