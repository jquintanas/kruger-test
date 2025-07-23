"use client";
import Loading from "@/core/components/Loading";
import { ReactNode, useState } from "react";
import LoadingContext from "./context";

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined);

  const showLoading = (text?: string) => {
    setLoading(true);
    setLoadingText(text);
  };

  const hideLoading = () => {
    setLoading(false);
    setLoadingText(undefined);
  };

  return (
    <LoadingContext.Provider value={{ loading, loadingText, showLoading, hideLoading }}>
      <Loading visible={loading} text={loadingText ?? "Cargando..."} />
      {children}
    </LoadingContext.Provider>
  );
};