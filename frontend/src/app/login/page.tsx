"use client";

import { TOKEN_KEY } from "@/core/const/global.const";
import { useLoading } from "@/core/hooks/useLoading";
import { useNotification } from "@/core/hooks/useNotification";
import { useUserData } from "@/core/hooks/useUserData";
import { loginService } from "@/core/services/auth.services";
import { parseErrorAxios } from "@/core/services/axios";
import { getUserData } from "@/core/services/user.services";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";



type LoginForm = {
  username: string;
  password: string;
};

export default function Login() {
  const { showLoading, hideLoading } = useLoading();

  const { showNotification } = useNotification();
  const router = useRouter();
  const { setUser } = useUserData();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    clearErrors();
    showLoading();
    try {
      if (!data.username || !data.password) {
        setError("username", { message: "Usuario requerido" });
        setError("password", { message: "Contraseña requerida" });
        return;
      }
      const response = await loginService(data.username, data.password);
      if (response.status !== 200) {
        throw new Error("Error de autenticación");
      }
      const token = response.data.token;
      localStorage.setItem(TOKEN_KEY, token);
      const userData = await getUserData();
      if (userData.status !== 200 || userData.data.length === 0) {
        throw new Error("Error al obtener datos del usuario");
      }
      const userDta = userData.data[0];
      setUser(userDta);

      hideLoading();
      router.push('/dashboard');
    } catch (err: any) {
      const parsedError = parseErrorAxios(err);
      showNotification("error", "Error de autenticación", parsedError);
      hideLoading();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-black bg-opacity-40"
        style={{
          backgroundImage:
            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAH5NLtj5BXwKKDCnDF7m9Xe-Z2aMt-iEdjg&s')",
          filter: "blur(8px)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white bg-opacity-90 shadow-md rounded px-8 pt-8 pb-8 w-full max-w-sm"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Iniciar Sesión
        </h2>
        {errors.root && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {errors.root.message}
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="username"
          >
            Usuario
          </label>
          <input
            id="username"
            type="email"
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? "border-red-500" : ""
              }`}
            {...register("username", { required: "Usuario requerido", pattern: { value: /^\S+@\S+$/, message: "Email inválido" } })}
            autoFocus
            autoComplete="username"
          />
          {errors.username && (
            <span className="text-red-600 text-xs">{errors.username.message}</span>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : ""
              }`}
            {...register("password", { required: "Contraseña requerida" })}
            autoComplete="current-password"
          />
          {errors.password && (
            <span className="text-red-600 text-xs">{errors.password.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none transition-colors"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}