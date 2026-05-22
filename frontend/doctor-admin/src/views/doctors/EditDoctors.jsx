import React, { useEffect, useState } from "react";
import axios from "axios";
import { specialties, doctorImages } from "./doctors_specialties";

const API = "http://localhost:8080/api/doctors";



// 🔹 initials
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};



const EditDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("ALL"); // 🔥 NEW
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [editDoctor, setEditDoctor] = useState(null);

  const token = localStorage.getItem("token");

  // ================= LOAD =================
  const loadDoctors = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setDoctors(res.data);
      } else {
        setDoctors([]);
      }
    } catch (err) {
      showToast("Failed to load doctors", "error");
      setDoctors([]);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // ================= TOAST =================
  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 3000);
  };

  // ================= UPDATE =================
  const updateDoctor = async () => {
    try {
      await axios.put(`${API}/${editDoctor.id}`, editDoctor, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Doctor updated successfully", "success");
      setEditDoctor(null);
      loadDoctors();
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  // ================= FILTER (SEARCH + SPECIALTY) =================
  const filtered = doctors.filter((d) => {
    const id = String(d?.id || d?._id || "");
    const name = String(d?.name || "");
    const spec = String(d?.specialization || "");

    const matchesSearch =
      search.trim() === "" ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      specialty === "ALL" || spec === specialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div style={page}>
      <h2>Edit Doctors</h2>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            ...toastStyle,
            background: toastType === "error" ? "#dc2626" : "#111",
          }}
        >
          {toast}
        </div>
      )}

      {/* SEARCH */}
      <input
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      {/* 🔥 SPECIALTY FILTER */}
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

      {/* GRID */}
      <div style={grid}>
        {filtered.map((d) => {
          const id = d.id || d._id;

          return (
            <div key={id} style={card}>
              {doctorImages[d.name] ? (
                <img
                  src={doctorImages[d.name]}
                  alt={d.name}
                  style={img}
                />
              ) : (
                <div style={avatar}>{getInitials(d.name)}</div>
              )}

              <h3>{d.name}</h3>
              <p style={specialization}>{d.specialization}</p>

              <button
                style={editBtn}
                onClick={() => setEditDoctor(d)}
              >
                EDIT
              </button>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editDoctor && (
        <div style={modalOverlay}>
          <div style={modal}>
            <h3>Edit Doctor</h3>

            <input
              style={input}
              value={editDoctor.name || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              style={input}
              value={editDoctor.specialization || ""}
              onChange={(e) =>
                setEditDoctor({
                  ...editDoctor,
                  specialization: e.target.value,
                })
              }
              placeholder="Specialization"
            />

            <input
              style={input}
              value={editDoctor.email || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, email: e.target.value })
              }
              placeholder="Email"
            />

            <input
              style={input}
              value={editDoctor.phone || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, phone: e.target.value })
              }
              placeholder="Phone"
            />

            <input
              style={input}
              value={editDoctor.address || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, address: e.target.value })
              }
              placeholder="Address"
            />

            <input
              style={input}
              value={editDoctor.clinicName || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, clinicName: e.target.value })
              }
              placeholder="Clinic Name"
            />

            <input
              style={input}
              value={editDoctor.description || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, description: e.target.value })
              }
              placeholder="Description"
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button style={saveBtn} onClick={updateDoctor}>
                SAVE
              </button>

              <button style={cancelBtn} onClick={() => setEditDoctor(null)}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDoctors;

// ================= STYLES =================

const page = { padding: 20 };

const input = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
  marginBottom: 15,
  width: "300px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 12,
};

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  border: "1px solid #eee",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const avatar = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  background: "#2563eb",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 12px",
  fontWeight: "bold",
  fontSize: 20,
};

const img = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  objectFit: "cover",
  margin: "0 auto 12px",
};

const specialization = {
  color: "#2563eb",
  fontWeight: "600",
};

const editBtn = {
  background: "#f97316",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 10,
  fontWeight: "bold",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  width: 350,
};

const saveBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: 10,
  flex: 1,
  borderRadius: 8,
};

const cancelBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: 10,
  flex: 1,
  borderRadius: 8,
};

const toastStyle = {
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
  color: "white",
};