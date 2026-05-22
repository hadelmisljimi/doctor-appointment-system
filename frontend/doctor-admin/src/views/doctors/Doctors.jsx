import React, { useEffect, useState } from "react";
import axios from "axios";
import { specialties, doctorImages } from "./doctors_specialties";


// =====================
// INITIAIS
// =====================
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};



// =====================
// GET IMAGE (SAFE)
// =====================
const getDoctorImage = (doc) => {
  const name = doc?.name;

  const img =
    doctorImages[name] ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "Doctor"
    )}&background=2563eb&color=fff`;

  return img;
};

// =====================
// COMPONENT
// =====================
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // SEARCH + FILTER
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("ALL");

  // LOAD DOCTORS
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/doctors")
      .then((res) => setDoctors(res.data || []))
      .catch((err) => console.log(err));
  }, []);

  // =====================
  // FILTER LOGIC
  // =====================
  const filteredDoctors = doctors.filter((d) => {
    const id = String(d.id || d._id || "");
    const name = String(d.name || "");
    const spec = String(d.specialization || "");

    const matchSearch =
      search === "" ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase());

    const matchSpecialty =
      specialty === "ALL" || spec === specialty;

    return matchSearch && matchSpecialty;
  });

  return (
    <div className="doctors-page">
      <h2 className="page-title">All Doctors</h2>

      {/* SEARCH + FILTER */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Search doctor by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            width: 250,
          }}
        />

        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        >
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="doctors-grid">
        {filteredDoctors.map((doc) => {
          const id = doc.id || doc._id;

          return (
            <div
              key={id}
              className="doctor-card-small"
              onClick={() => setSelectedDoctor(doc)}
            >
              <img
                src={getDoctorImage(doc)}
                className="doctor-avatar"
                alt={doc.name}
              />

              <h5 className="doctor-name">{doc.name}</h5>

              <span className="doctor-specialty">
                {doc.specialization}
              </span>
            </div>
          );
        })}
      </div>

      {/* NO DATA */}
      {filteredDoctors.length === 0 && (
        <div style={{ marginTop: 20, color: "gray" }}>
          No doctors found
        </div>
      )}

      {/* MODAL */}
      {selectedDoctor && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* IMAGE */}
            <img
              src={getDoctorImage(selectedDoctor)}
              className="modal-avatar"
              alt={selectedDoctor.name}
            />

            <h2>{selectedDoctor.name}</h2>

            <p className="badge">
              {selectedDoctor.specialization}
            </p>

            <div className="modal-info">
              <p>
                <b>Email:</b> {selectedDoctor.email}
              </p>
              <p>
                <b>Phone:</b> {selectedDoctor.phone}
              </p>
              <p>
                <b>Address:</b> {selectedDoctor.address}
              </p>
              <p>
                <b>Clinic:</b> {selectedDoctor.clinicName}
              </p>
              <p>
                <b>Description:</b>{" "}
                {selectedDoctor.description}
              </p>
            </div>

            <button
              className="close-btn"
              onClick={() => setSelectedDoctor(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;