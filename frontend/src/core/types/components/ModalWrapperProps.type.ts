import { ReactNode } from "react"

export type ModalWrapperProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}