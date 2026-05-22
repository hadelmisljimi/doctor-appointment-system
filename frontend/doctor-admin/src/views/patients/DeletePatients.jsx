import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/patients";

// 🔹 inicijali
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};

const DeletePatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [confirmId, setConfirmId] = useState(null);

  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);

  // ================= LOAD =================
  const loadPatients = async () => {
  try {
    const res = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("PATIENTS:", res.data);

    setPatients(res.data || []);
  }  catch (err) {
  console.log("LOAD PATIENTS ERROR:", err);

  const msg =
    err.response?.data?.message ||
    err.response?.data?.error ||
    "Failed to load patients";

  showToast(String(msg), "error");
}
};

useEffect(() => {
  loadPatients();
}, []);
  // ================= TOAST =================
  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  // ================= DELETE =================
  const deletePatient = async (id) => {
  try {
    await axios.delete(`${API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showToast(
      "🟢 Patient deleted successfully",
      "success"
    );

    setConfirmId(null);

    loadPatients();
  } catch (err) {
    console.log(err);

    const msg =
      err.response?.data ||
      "❌ Delete failed (server or DB error)";

    showToast(msg, "error");
  }
};

  // ================= FILTER =================
  const filtered = Array.isArray(patients)
  ? patients.filter((p) => {
      const id = p?.id || p?._id || "";

      const name = p?.name || "";

      return (
        search.trim() === "" ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        id.toLowerCase().includes(search.toLowerCase())
      );
    })
  : [];

  return (
    <div style={page}>
      <h2>Delete Patients</h2>

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
        placeholder="Search patient by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      {/* NO DATA */}
      {filtered.length === 0 && (
        <div style={noData}>No patients found</div>
      )}

      {/* CARDS */}
      <div style={grid}>
        {filtered.map((p) => {
          const id = p.id || p._id;

          return (
            <div key={id} style={card}>
              <div style={avatar}>{getInitials(p.name)}</div>

              <h3>{p.name}</h3>

              <p style={{ fontSize: "12px", color: "gray" }}>
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
                  <p>Are you sure you want to delete?</p>

                  <button
                    style={yesBtn}
                    onClick={() => deletePatient(id)}
                  >
                    YES
                  </button>

                  <button
                    style={noBtn}
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

export default DeletePatients;

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
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
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
  width: 50,
  height: 50,
  borderRadius: "50%",
  background: "#2563eb",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 10px",
  fontWeight: "bold",
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 10,
};

const confirmBox = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  background: "#f9f9f9",
};

const yesBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: 6,
  marginRight: 5,
  borderRadius: 6,
};

const noBtn = {
  background: "gray",
  color: "white",
  border: "none",
  padding: 6,
  borderRadius: 6,
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