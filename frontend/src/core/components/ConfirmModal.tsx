import React from "react";
import ModalWrapper from "./Modal";


interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  showModal: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  onConfirm,
  onCancel,
  showModal
}) => {

  return (
    <ModalWrapper isOpen={showModal} title="Confirmar" onClose={onCancel} >
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center">
          <p className="text-lg font-medium mb-6 text-black">{message}</p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={onConfirm}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>

  );
};
