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

const DeleteDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [confirmId, setConfirmId] = useState(null);
  const [specialty, setSpecialty] = useState("ALL");

  const token = localStorage.getItem("token");

  // ================= LOAD =================
  const loadDoctors = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("DOCTORS RESPONSE:", res.data);

      // 🔥 FIX
      if (Array.isArray(res.data)) {
        setDoctors(res.data);
      } else {
        setDoctors([]);
      }
    } catch (err) {
      console.log("LOAD DOCTORS ERROR:", err);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        "Failed to load doctors";

      showToast(String(msg), "error");

      setDoctors([]);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // ================= TOAST =================
  const showToast = (msg, type = "success") => {
    setToast(String(msg));
    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  // ================= DELETE =================
  const deleteDoctor = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast(
        "🟢 Doctor deleted successfully",
        "success"
      );

      setConfirmId(null);

      loadDoctors();
    } catch (err) {
      console.log("DELETE ERROR:", err);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        "❌ Delete failed";

      showToast(String(msg), "error");
    }
  };

  // ================= FILTER =================
  const filtered = Array.isArray(doctors)
  ? doctors.filter((d) => {
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
    })
  : [];

  return (
    <div style={page}>
      <h2>Delete Doctors</h2>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            ...toastStyle,
            background:
              toastType === "error"
                ? "#dc2626"
                : "#111",
          }}
        >
          {toast}
        </div>
      )}

      {/* SEARCH */}
      <input
        placeholder="Search doctor by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />
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

      {/* NO DATA */}
      {filtered.length === 0 && (
        <div style={noData}>
          No doctors found
        </div>
      )}

      {/* CARDS */}
      <div style={grid}>
        {filtered.map((d) => {
          const id = d.id || d._id;

          return (
            <div key={id} style={card}>
              {doctorImages[d.name] ? (
  <img
    src={doctorImages[d.name]}
    alt={d.name}
    style={{
      width: 60,
      height: 60,
      borderRadius: "50%",
      objectFit: "cover",
      margin: "0 auto 12px",
    }}
  />
) : (
  <div style={avatar}>
    {getInitials(d.name)}
  </div>
)}

              <h3>{d.name}</h3>

              <p style={specialization}>
                {d.specialization}
              </p>

              <p style={idText}>
                ID: {id}
              </p>

              <button
                style={deleteBtn}
                onClick={() => setConfirmId(id)}
              >
                DELETE
              </button>

              {/* CONFIRM */}
              {confirmId === id && (
                <div style={confirmBox}>
                  <p>
                    Are you sure you want to delete?
                  </p>

                  <button
                    style={yesBtn}
                    onClick={() => deleteDoctor(id)}
                  >
                    YES
                  </button>

                  <button
                    style={noBtn}
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

export default DeleteDoctors;

// ================= STYLES =================

const page = {
  padding: 20,
};

const input = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
  marginBottom: 15,
  width: "300px",
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 12,
};

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  border: "1px solid #eee",
  textAlign: "center",
  position: "relative",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: 260,
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

const specialization = {
  color: "#2563eb",
  fontWeight: "600",
  marginBottom: 8,
};

const idText = {
  fontSize: "12px",
  color: "gray",
};

const deleteBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 10,
  fontWeight: "bold",
};

const confirmBox = {
  marginTop: 12,
  padding: 10,
  borderRadius: 10,
  background: "#f9f9f9",
};

const yesBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: 7,
  marginRight: 5,
  borderRadius: 6,
  cursor: "pointer",
};

const noBtn = {
  background: "gray",
  color: "white",
  border: "none",
  padding: 7,
  borderRadius: 6,
  cursor: "pointer",
};

const toastStyle = {
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
  color: "white",
};

const noData = {
  textAlign: "center",
  marginTop: 20,
  color: "gray",
};