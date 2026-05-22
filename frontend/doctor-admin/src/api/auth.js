import axios from "axios"

const API = "http://localhost:8080/api/auth"

export const login = async (username, password) => {
  const res = await axios.post(`${API}/login`, {
    username,
    password,
  })

  return res.data
}

export const registerPatient = async (username, password) => {
  const res = await axios.post(`${API}/register/patient`, {
    username,
    password,
  })

  return res.data
}

export const registerDoctor = async (username, password, token) => {
  const res = await axios.post(
    `${API}/register/doctor`,
    { username, password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}