'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ModalWrapperProps } from '../types/components/ModalWrapperProps.type'



export default function ModalWrapper({
  isOpen,
  onClose,
  title = 'Modal title',
  children
}: ModalWrapperProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl z-10"
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 bg-white dark:bg-gray-800">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:size-10">
                  <span className="text-red-600 dark:text-red-400 text-xl">!</span>
                </div>
                <div className="mt-3 text-center w-full">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                  </DialogTitle>
                  <div className="mt-2 text-gray-700 dark:text-gray-300">{children}</div>
                </div>
              </div>
            </div>
            {/* Se elimina el botón Cancelar del pie */}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
