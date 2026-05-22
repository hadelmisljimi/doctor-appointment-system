import React, { useState } from "react"
import {
  registerPatient,
  registerDoctor,
} from "../../../api/auth"

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [type, setType] = useState("patient")
  const [message, setMessage] = useState("")

  const role = localStorage.getItem("role")
  const token = localStorage.getItem("token")

  const handleRegister = async () => {
    try {
      setMessage("")

      // VALIDACIJA
      if (!username.trim()) {
        setMessage("❌ Username is required")
        return
      }

      if (username.length < 3) {
        setMessage("❌ Username must have at least 3 characters")
        return
      }

      if (!password.trim()) {
        setMessage("❌ Password is required")
        return
      }

      if (password.length < 3) {
        setMessage("❌ Password must have at least 3 characters")
        return
      }

      // REGISTER PATIENT
      if (type === "patient") {
        await registerPatient(username, password)

        setMessage("✅ Patient registered successfully")
      }

      // REGISTER DOCTOR
      if (type === "doctor") {
        if (role !== "ADMIN") {
          setMessage("❌ Only ADMIN can register doctors")
          return
        }

        await registerDoctor(username, password, token)

        setMessage("✅ Doctor registered successfully")
      }

      setUsername("")
      setPassword("")
    } catch (err) {
      console.log(err)

      if (err.response?.status === 400) {
        setMessage("❌ Username already exists")
      } else if (err.response?.status === 401) {
        setMessage("❌ Unauthorized")
      } else if (err.response?.status === 403) {
        setMessage("❌ Only ADMIN can register doctors")
      } else {
        setMessage("❌ Registration failed")
      }
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
      }}
    >
      <div
        style={{
          width: "520px",
          className="dynamic-card",
          borderRadius: "20px",
          padding: "45px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
          borderTop: "6px solid #16a34a",
        }}
      >
        <div className="text-center mb-4">
  <h1
    style={{
      color: "#16a34a",
      fontWeight: "bold",
    }}
  >
    Create Account
  </h1>

  {!role ? (
    <p style={{ color: "#64748b" }}>
      If you already register, go to login in your account!
    </p>
  ) : role === "ADMIN" ? (
    <p style={{ color: "#64748b" }}>
      Register Doctor or Patient account
    </p>
  )  : role === "DOCTOR" ? (
  <p style={{ color: "#64748b" }}>
    Register Doctor or Patient account
  </p>
) : (
  <p style={{ color: "#64748b" }}>
    Register Patient account
  </p>
)}
</div>

        {/* TYPE */}
        <div className="mb-3">
          <label className="fw-bold mb-2">
            Account Type
          </label>

          <select
            className="form-control dynamic-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              height: "50px",
              borderRadius: "10px",
            }}
          >
            <option value="patient">
              Patient
            </option>

            {role === "ADMIN" && (
              <option value="doctor">
                Doctor
              </option>
            )}
          </select>
        </div>

        {/* USERNAME */}
        <div className="mb-3">
          <label className="fw-bold mb-2">
            Username
          </label>

          <input
            type="text"
            className="form-control dynamic-input"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              height: "50px",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="fw-bold mb-2">
            Password
          </label>

          <input
            type="password"
            className="form-control dynamic-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              height: "50px",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          className="btn w-100"
          onClick={handleRegister}
          style={{
            background: "#16a34a",
            color: "white",
            height: "50px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "17px",
          }}
        >
          REGISTER
        </button>

        {/* MESSAGE */}
        {message && (
          <div
            className="mt-4 text-center"
            style={{
              color: message.includes("✅")
                ? "#16a34a"
                : "#dc2626",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Register;