import React from "react"

const Authorize = () => {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  return (
    <div className="container mt-5 text-white">
      <h2>Authorize Page</h2>

      <div className="card p-3 bg-dark text-white">
        <p><b>Token:</b> {token || "No token"}</p>
        <p><b>Role:</b> {role || "No role"}</p>
      </div>
    </div>
  )
}

export default Authorize