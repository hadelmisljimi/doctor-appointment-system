import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/patients";

// 🔹 initials
const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.split(" ");

  return (
    (parts[0]?.[0] || "") +
    (parts[1]?.[0] || "")
  );
};

const EditPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const [editPatient, setEditPatient] = useState(null);

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

    } catch (err) {

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
  const showToast = (
    msg,
    type = "success"
  ) => {
    setToast(msg);
    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  // ================= UPDATE =================
  const updatePatient = async () => {
    try {

      await axios.put(
        `${API}/${editPatient.id}`,
        {
          name: editPatient.name,
          email: editPatient.email,
          phone: editPatient.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast(
        "🟢 Patient updated successfully",
        "success"
      );

      setEditPatient(null);

      loadPatients();

    } catch (err) {

      console.log(err);

      const msg =
        err.response?.data ||
        "❌ Update failed";

      showToast(String(msg), "error");
    }
  };

  // ================= FILTER =================
  const filtered = Array.isArray(patients)
    ? patients.filter((p) => {

        const id =
          String(p?.id || p?._id || "");

        const name =
          p?.name || "";

        return (
          search.trim() === "" ||

          name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

          id
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      })
    : [];

  return (
    <div style={page}>

      <h2>Edit Patients</h2>

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
        placeholder="Search patient by name or ID..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={input}
      />

      {/* NO DATA */}
      {filtered.length === 0 && (
        <div style={noData}>
          No patients found
        </div>
      )}

      {/* CARDS */}
      <div style={grid}>

        {filtered.map((p) => {

          const id =
            p.id || p._id;

          return (
            <div
              key={id}
              style={card}
            >

              <div style={avatar}>
                {getInitials(p.name)}
              </div>

              <h3>{p.name}</h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  fontWeight: "600",
                }}
              >
                {p.email}
              </p>

              <p
                style={{
                  fontSize: "12px",
                  color: "gray",
                }}
              >
                {p.phone}
              </p>

              <p
                style={{
                  fontSize: "12px",
                  color: "gray",
                }}
              >
                ID: {id}
              </p>

              <button
                style={editBtn}
                onClick={() =>
                  setEditPatient(p)
                }
              >
                EDIT
              </button>

            </div>
          );
        })}

      </div>

      {/* EDIT MODAL */}
      {editPatient && (
        <div style={modalOverlay}>

          <div style={modal}>

            <h3>Edit Patient</h3>

            <input
              style={modalInput}
              placeholder="Name"
              value={
                editPatient.name || ""
              }
              onChange={(e) =>
                setEditPatient({
                  ...editPatient,
                  name: e.target.value,
                })
              }
            />

            <input
              style={modalInput}
              placeholder="Email"
              value={
                editPatient.email || ""
              }
              onChange={(e) =>
                setEditPatient({
                  ...editPatient,
                  email: e.target.value,
                })
              }
            />

            <input
              style={modalInput}
              placeholder="Phone"
              value={
                editPatient.phone || ""
              }
              onChange={(e) =>
                setEditPatient({
                  ...editPatient,
                  phone: e.target.value,
                })
              }
            />

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
              }}
            >

              <button
                style={saveBtn}
                onClick={updatePatient}
              >
                SAVE
              </button>

              <button
                style={cancelBtn}
                onClick={() =>
                  setEditPatient(null)
                }
              >
                CANCEL
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default EditPatients;

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
  boxShadow:
    "0 4px 12px rgba(0,0,0,0.06)",

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: 300,
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

const editBtn = {
  background: "#f97316",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 10,
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
  zIndex: 999,
};

const modal = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  width: 350,
};

const modalInput = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  marginBottom: 12,
};

const saveBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: 10,
  flex: 1,
  borderRadius: 8,
  cursor: "pointer",
};

const cancelBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: 10,
  flex: 1,
  borderRadius: 8,
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