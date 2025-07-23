import { FullScreenLoaderProps } from "../types/components/Loading.type";


const Loading = ({ visible, text }: FullScreenLoaderProps) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-40">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-white text-lg font-semibold">{text || "Cargando..."}</span>
      </div>
    </div>
  );
};

export default Loading;