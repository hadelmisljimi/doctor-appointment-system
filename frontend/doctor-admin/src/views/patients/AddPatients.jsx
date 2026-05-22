import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/patients";

// initials
const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.split(" ");

  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};

const AddPatients = () => {
  const [patients, setPatients] = useState([]);

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const token = localStorage.getItem("token");

  // LOAD
  const loadPatients = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showToast("Failed to load patients", "error");
    }
  };

  useEffect(() => {
    loadPatients();
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

  // VALIDATION
  const isFormValid = () => {
    return (
      newPatient.name &&
      newPatient.email &&
      newPatient.phone
    );
  };

  // ADD PATIENT
  const addPatient = async () => {
    if (!isFormValid()) {
      return showToast(
        "All fields must be filled",
        "error"
      );
    }

    if (!isValidEmail(newPatient.email)) {
      return showToast(
        "Invalid email format",
        "error"
      );
    }

    try {
      await axios.post(API, newPatient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast(
        "Patient added successfully",
        "success"
      );

      setNewPatient({
        name: "",
        email: "",
        phone: "",
      });

      loadPatients();
    } catch (err) {
      showToast(
        "Failed to add patient",
        "error"
      );
    }
  };

  return (
    <div style={page}>
      <h2>Add Patients</h2>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            ...toastStyle,
            background:
              toastType === "success"
                ? "green"
                : "red",
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
          value={newPatient.name}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              name: e.target.value,
            })
          }
        />

        <input
          style={input}
          placeholder="Email"
          value={newPatient.email}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              email: e.target.value,
            })
          }
        />

        <input
          style={input}
          placeholder="Phone"
          value={newPatient.phone}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              phone: e.target.value,
            })
          }
        />

        <button
          style={addBtn}
          onClick={addPatient}
        >
          ADD PATIENT
        </button>
      </div>
    </div>
  );
};

export default AddPatients;

/* ================= STYLES ================= */

const page = {
  padding: 20,
};

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
  boxShadow:
    "0 4px 12px rgba(0,0,0,0.06)",
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