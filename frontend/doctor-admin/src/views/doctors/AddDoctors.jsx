import React, { useEffect, useState } from "react";
import axios from "axios";
import { specialties, doctorImages } from "./doctors_specialties";

const API = "http://localhost:8080/api/doctors";



// initials
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};



const AddDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    address: "",
    clinicName: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  // LOAD
  const loadDoctors = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showToast("Failed to load doctors", "error");
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // TOAST
  const showToast = (msg, type) => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 3000);
  };

  // EMAIL CHECK
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // VALIDATION CHECK
  const isFormValid = () => {
    return (
      newDoctor.name &&
      newDoctor.specialization &&
      newDoctor.email &&
      newDoctor.phone &&
      newDoctor.address &&
      newDoctor.clinicName &&
      newDoctor.description
    );
  };

  // ADD DOCTOR
  const addDoctor = async () => {
    if (!isFormValid()) {
      return showToast("All fields must be filled", "error");
    }

    if (!isValidEmail(newDoctor.email)) {
      return showToast("Invalid email format", "error");
    }

    try {
      await axios.post(API, newDoctor, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Doctor added successfully", "success");

      setNewDoctor({
        name: "",
        specialization: "",
        email: "",
        phone: "",
        address: "",
        clinicName: "",
        description: "",
      });

      loadDoctors();
    } catch (err) {
      showToast("Failed to add doctor", "error");
    }
  };

  return (
    <div style={page}>
      <h2>Add Doctors</h2>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            ...toastStyle,
            background: toastType === "success" ? "green" : "red",
          }}
        >
          {toast}
        </div>
      )}

      {/* FORM */}
      <div style={formBox}>
        <input
          style={input}
          placeholder="Name"
          value={newDoctor.name}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, name: e.target.value })
          }
        />

        <select
          style={input}
          value={newDoctor.specialization}
          onChange={(e) =>
            setNewDoctor({
              ...newDoctor,
              specialization: e.target.value,
            })
          }
        >
          <option value="">Select specialization</option>
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          style={input}
          placeholder="Email"
          value={newDoctor.email}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, email: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Phone"
          value={newDoctor.phone}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, phone: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Address"
          value={newDoctor.address}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, address: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Clinic Name"
          value={newDoctor.clinicName}
          onChange={(e) =>
            setNewDoctor({
              ...newDoctor,
              clinicName: e.target.value,
            })
          }
        />

        <input
          style={input}
          placeholder="Description"
          value={newDoctor.description}
          onChange={(e) =>
            setNewDoctor({
              ...newDoctor,
              description: e.target.value,
            })
          }
        />

        <button style={addBtn} onClick={addDoctor}>
          ADD DOCTOR
        </button>
      </div>

      
    </div>
  );
};

export default AddDoctors;

/* ================= STYLES ================= */

const page = { padding: 20 };

const input = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
  marginBottom: 10,
  width: "100%",
};

const formBox = {
  width: "100%",
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};



const addBtn = {
  background: "green",
  color: "white",
  border: "none",
  padding: 12,
  borderRadius: 8,
  width: "100%",
  fontWeight: "bold",
  cursor: "pointer",
};

const toastStyle = {
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
  color: "white",
};