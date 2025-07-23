import { LoadingContextProps } from "@/core/interfaces/LoadingContext.interface";
import { createContext } from "react";

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export default LoadingContext;