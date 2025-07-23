import { UserData } from "../interfaces/users.interface";
import { axiosGeneral } from "./axios";

export const getUserData = () => {
  return axiosGeneral.get<UserData[]>(process.env.NEXT_PUBLIC_USERS ?? "");
}