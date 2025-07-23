import axios from "axios";

const axiosLogin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginService = (user: string, password: string) => {
  return axiosLogin.post(process.env.NEXT_PUBLIC_LOGIN ?? "", {
    email: user,
    password
  })
}