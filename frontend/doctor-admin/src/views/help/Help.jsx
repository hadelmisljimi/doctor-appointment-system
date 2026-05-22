import React, { useState } from "react";

const DATA = [
  {
    title: "AUTH SYSTEM",
    color: "#2563eb",
    items: [
      {
        q: "How does login work?",
        a: `Login uses JWT authentication. After successful login, token is stored in localStorage.
It is automatically attached to every API request via Authorization header.

If token is missing or expired, user is redirected to login page.`,
      },
      {
        q: "Who can register doctors?",
        a: `Only ADMIN can register doctors.
Doctor registration includes: name, email, specialization, clinic info and phone number.`,
      },
      {
        q: "What roles exist?",
        a: `System has 3 roles:
- ADMIN (full access)
- DOCTOR (patients + appointments)
- PATIENT (book appointments only)`,
      },
    ],
  },

  {
    title: "DOCTORS MODULE",
    color: "#16a34a",
    items: [
      {
        q: "How to add a doctor?",
        a: `Go to Doctors → Add Doctor page.
Fill all required fields (name, specialization, email, phone, clinic name).
Only ADMIN can perform this action.`,
      },
      {
        q: "How edit doctor works?",
        a: `Click EDIT button on doctor card.
A modal opens where you can update data.
After clicking SAVE, PUT request updates backend.`,
      },
      {
        q: "Delete doctor?",
        a: `Only ADMIN can delete doctors.
Deletion is permanent and removes doctor from database.`,
      },
    ],
  },

  {
    title: "PATIENTS MODULE",
    color: "#f59e0b",
    items: [
      {
        q: "How to add patient?",
        a: `Patients can be added by ADMIN or DOCTOR.
Required fields: name, email, phone.
Data is saved in database via POST /api/patients.`,
      },
      {
        q: "Edit patient?",
        a: `Click EDIT button → modal opens → change values → SAVE.
System sends PUT request to update patient.`,
      },
      {
        q: "Delete patient?",
        a: `Patients can be deleted by ADMIN or DOCTOR.
Action is irreversible.`,
      },
    ],
  },

  {
    title: "APPOINTMENTS",
    color: "#ef4444",
    items: [
      {
        q: "How to book appointment?",
        a: `Patient selects doctor and time slot.
Appointment is saved with status BOOKED.`,
      },
      {
        q: "Completed appointments?",
        a: `Doctor or ADMIN can mark appointment as COMPLETED after visit.`,
      },
      {
        q: "Cancelled appointments?",
        a: `Appointments can be cancelled by patient or doctor depending on role.`,
      },
      {
        q: "Delete appointment?",
        a: `Only ADMIN/DOCTOR can delete appointments permanently.`,
      },
    ],
  },
];

const Help = () => {
  const [open, setOpen] = useState(null);

  return (
    <div style={page}>
      <h1 style={title}>Help Center</h1>
      <p style={subtitle}>
        Click on a question to see detailed explanation of how the system works.
      </p>

      <div style={grid}>
        {DATA.map((section, i) => (
          <div key={i} style={{ ...card, borderTop: `4px solid ${section.color}` }}>
            <h2 style={cardTitle}>{section.title}</h2>

            {section.items.map((item, index) => (
              <div key={index} style={qaBox}>
                <div
                  style={question}
                  onClick={() =>
                    setOpen(open === item.q ? null : item.q)
                  }
                >
                  <span>{item.q}</span>
                  <span style={{ fontSize: 18 }}>
                    {open === item.q ? "−" : "+"}
                  </span>
                </div>

                {open === item.q && (
                  <div style={answer}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;

/* ================= STYLES ================= */

const page = {
  padding: 25,
  background: "#f5f7fb",
  minHeight: "100vh",
};

const title = {
  fontSize: 30,
  fontWeight: "bold",
};

const subtitle = {
  color: "#666",
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 20,
};

const card = {
  background: "white",
  borderRadius: 14,
  padding: 18,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const cardTitle = {
  marginBottom: 15,
  fontSize: 18,
};

const qaBox = {
  borderTop: "1px solid #eee",
  paddingTop: 10,
  marginTop: 10,
};

const question = {
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: 14,
};

const answer = {
  marginTop: 10,
  fontSize: 13,
  color: "#555",
  lineHeight: 1.5,
  whiteSpace: "pre-line",
};