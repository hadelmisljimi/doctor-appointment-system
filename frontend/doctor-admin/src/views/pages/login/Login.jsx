import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../../../api/auth"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      setMessage("")

      // VALIDACIJA
      if (!username.trim()) {
        setMessage("❌ Username is required")
        return
      }

      if (!password.trim()) {
        setMessage("❌ Password is required")
        return
      }

      const data = await login(username, password)

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)
      localStorage.setItem("username", username)

      // REDIRECT
      if (data.role === "ADMIN") {
        navigate("/doctors")
      } else if (data.role === "DOCTOR") {
        navigate("/patients")
      } else {
        navigate("/appointments")
      }
    }  catch (err) {
  console.log(err)

  // backend vraca 401
  if (err.response?.status === 401) {
    setError("❌ Username or password does not exist")
  }

  // backend vraca 404
  else if (err.response?.status === 404) {
    setError("❌ User does not exist")
  }

  // backend nije dostupan
  else if (err.code === "ERR_NETWORK") {
    setError("❌ Cannot connect to server")
  }

  // ostalo
  else {
    setError("❌ Login failed")
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
          borderTop: "6px solid #2563eb",
        }}
      >
        <div className="text-center mb-4">
          <h1
            style={{
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            Login to your account
          </h1>

          <p style={{ color: "#64748b" }}>
            If you don't have account register first
          </p>
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

        {/* LOGIN */}
        <button
          className="btn w-100 mb-3"
          onClick={handleLogin}
          style={{
            background: "#2563eb",
            color: "white",
            height: "50px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "17px",
          }}
        >
          LOGIN
        </button>

        {/* REGISTER PATIENT */}
        <Link
          to="/register"
          className="btn w-100"
          style={{
            background: "#16a34a",
            color: "white",
            height: "50px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "17px",
            paddingTop: "11px",
          }}
        >
          REGISTER PATIENT
        </Link>

        {/* MESSAGE */}
        {message && (
          <div
            className="mt-4 text-center"
            style={{
              color: "#dc2626",
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

export default Login;