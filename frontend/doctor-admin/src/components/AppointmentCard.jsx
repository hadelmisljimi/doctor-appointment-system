import React from "react";

const doctorImages = {
  "Dr. Vildon Bajrami": "/images/doctors/1.jpg",
  "Dr. Sarah Johnson": "/images/doctors/9.jpg",
  "Dr. James Wilson": "/images/doctors/2.jpg",
  "Dr. Emily Davis": "/images/doctors/10.jpg",
  "Dr. Robert Miller": "/images/doctors/3.jpg",
  "Dr. Laura Martinez": "/images/doctors/11.jpg",
  "Dr. David Anderson": "/images/doctors/4.jpg",
  "Dr. Olivia Thomas": "/images/doctors/12.jpg",
  "Dr. Christopher Lee": "/images/doctors/5.jpg",
  "Dr. Sophia White": "/images/doctors/13.jpg",
  "Dr. William Harris": "/images/doctors/6.jpg",
  "Dr. Ava Clark": "/images/doctors/14.jpg",
  "Dr. Daniel Lewis": "/images/doctors/7.jpg",
  "Dr. Mia Walker": "/images/doctors/15.jpg",
  "Dr Anil Fazlija": "/images/doctors/8.jpg",
};

// =========================
// SPECIALTY MAP
// =========================
const doctorSpecialties = {
  "Dr. Vildon Bajrami": "GENERAL_PRACTITIONER",
  "Dr. Sarah Johnson": "CARDIOLOGIST",
  "Dr. James Wilson": "NEUROLOGIST",
  "Dr. Emily Davis": "PEDIATRICIAN",
  "Dr. Robert Miller": "ORTHOPEDIC_SURGEON",
  "Dr. Laura Martinez": "OPHTHALMOLOGIST",
  "Dr. David Anderson": "ENT_SPECIALIST",
  "Dr. Olivia Thomas": "CARDIOLOGIST",
  "Dr. Christopher Lee": "NEUROLOGIST",
  "Dr. Sophia White": "PEDIATRICIAN",
  "Dr. William Harris": "ORTHOPEDIC_SURGEON",
  "Dr. Ava Clark": "GENERAL_PRACTITIONER",
  "Dr. Daniel Lewis": "ENT_SPECIALIST",
  "Dr. Mia Walker": "OPHTHALMOLOGIST",
  "Dr Anil Fazlija": "GENERAL_PRACTITIONER",
};

const getInitials = (name) => {
  if (!name) return "?";

  const p = name.split(" ");

  return (
    (p[0]?.[0] || "") +
    (p[1]?.[0] || "")
  ).toUpperCase();
};

const AppointmentCard = ({
  appt,
  onDelete,
  onCancel,
  onComplete,
  onEdit,
}) => {

  const specialty =
    doctorSpecialties[appt.doctorName] ||
    "GENERAL_PRACTITIONER";

  return (
    <div style={styles.card}>

      {/* DOCTOR */}
      <div style={styles.row}>
        <img
          src={
            doctorImages[appt.doctorName] ||
            "/images/doctors/default.jpg"
          }
          alt="doctor"
          style={styles.img}
        />

        <div>
          <b>{appt.doctorName}</b>

          <div style={styles.small}>
            {specialty}
          </div>
        </div>
      </div>

      {/* PATIENT */}
      <div style={styles.row}>
        <div style={styles.avatar}>
          {getInitials(appt.patientName)}
        </div>

        <div>
          <b>{appt.patientName}</b>

          <div style={styles.small}>
            Patient
          </div>
        </div>
      </div>

      {/* INFO */}
      <div style={{ marginTop: 10 }}>
        <div>
          <b>Date:</b> {appt.date}
        </div>

        <div>
          <b>Time:</b> {appt.time}
        </div>

        <div>
          <b>Status:</b> {appt.status}
        </div>
      </div>

      {/* ACTIONS */}
      <div style={styles.actions}>

        {onEdit && (
          <button
            style={styles.edit}
            onClick={() => onEdit(appt)}
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            style={styles.delete}
            onClick={() => onDelete(appt)}
          >
            Delete
          </button>
        )}

        {onCancel && (
          <button
            style={styles.cancel}
            onClick={() => onCancel(appt)}
          >
            Cancel
          </button>
        )}

        {onComplete && (
          <button
            style={styles.complete}
            onClick={() => onComplete(appt)}
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;

// =========================
// STYLES
// =========================

const styles = {
  card: {
    background: "white",
    padding: 14,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    marginBottom: 12,
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  img: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    objectFit: "cover",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  small: {
    fontSize: 12,
    color: "#64748b",
  },

  actions: {
    display: "flex",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },

  delete: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "7px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },

  cancel: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "7px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },

  complete: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "7px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },

  edit: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "7px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
};