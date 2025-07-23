import axios from "axios";
import { TOKEN_KEY } from "../const/global.const";

// Instancia básica para login (sin token)


// Instancia protegida con interceptor para JWT
export const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosGeneral = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosGeneral.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const parseErrorAxios = (err: any) => {
  try {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        return err.response.data.message || "Error del servidor";
      } else if (err.request) {
        return "No se recibió respuesta del servidor";
      } else {
        return err.message;
      }
    }
    return "Error desconocido";
  }
  catch (error) {
    console.error(error);
    return "Error al procesar la solicitud";
  }
}