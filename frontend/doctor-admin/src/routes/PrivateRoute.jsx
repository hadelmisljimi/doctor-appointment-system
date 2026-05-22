import React from "react";

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // NOT LOGGED IN
  if (!token) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.redTitle}>Login Required</h1>
          <p style={styles.text}>
            You must login first to access this page.
          </p>
        </div>
      </div>
    );
  }

  // ROLE CHECK
  if (roles && !roles.includes(role)) {
    let title = "Access Denied";
    let message = "You do not have permission to access this page.";

    if (roles.includes("ADMIN") && roles.includes("DOCTOR")) {
      title = "Doctor & Admin Only";
      message = "This page can only be accessed by doctors or administrators.";
    } else if (roles.length === 1 && roles.includes("ADMIN")) {
      title = "Admin Only";
      message = "This page can only be accessed by administrators.";
    }

    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.redTitle}>{title}</h1>
          <p style={styles.text}>{message}</p>
        </div>
      </div>
    );
  }

  return children;
};

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f9ff",
  },
  card: {
    width: "500px",
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  redTitle: {
    color: "#dc2626",
    marginBottom: 10,
  },
  text: {
    color: "#475569",
    fontSize: 16,
  },
};

export default PrivateRoute;