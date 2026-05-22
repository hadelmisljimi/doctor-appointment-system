import React, { useEffect, useState } from "react"
import axios from "axios"

// 👉 inicijali (John Smith = JS)
const getInitials = (name) => {
  if (!name) return "?"
  const parts = name.split(" ")
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "")
}

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    axios.get("http://localhost:8080/api/patients")
      .then((res) => {
        console.log("PATIENTS RESPONSE:", res.data)
        setPatients(res.data)
      })
      .catch((err) => console.log("ERROR:", err))
  }, [])

  // 🔥 FILTER (NAME + ID)
  const filteredPatients = patients.filter((p) => {
    const id = p.id || p._id

    const textMatch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(id).toLowerCase().includes(search.toLowerCase())

    return textMatch
  })

  return (
    <div className="patients-page">
      <h2 className="page-title">All Patients</h2>

      {/* 🔍 SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search patient by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "100%",
          maxWidth: "300px"
        }}
      />

      {/* GRID */}
      <div className="patients-grid">
        {filteredPatients.map((pat) => (
          <div
            key={pat.id}
            className="patient-card"
            onClick={() => setSelectedPatient(pat)}
          >
            <div className="patient-avatar">
              {getInitials(pat.name)}
            </div>

            <h5 className="patient-name">{pat.name}</h5>

            <span className="patient-specialty">
              Patient
            </span>
          </div>
        ))}
      </div>

      {/* POPUP */}
      {selectedPatient && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="patient-modal-avatar">
              {getInitials(selectedPatient.name)}
            </div>

            <h2>{selectedPatient.name}</h2>

            <p className="patient-specialty">Patient</p>

            <div className="modal-info">
              <p><b>Email:</b> {selectedPatient.email}</p>
              <p><b>Phone:</b> {selectedPatient.phone}</p>
              <p><b>Address:</b> {selectedPatient.address}</p>
            </div>

            <button
              className="close-btn"
              onClick={() => setSelectedPatient(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  )
}

export default Patients