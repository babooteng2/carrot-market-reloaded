import { MouseEventHandler } from "react"
import Button from "@/components/button"

function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean
  onClose: MouseEventHandler<HTMLButtonElement>
  onConfirm: MouseEventHandler<HTMLButtonElement>
  title: String
  message: String
}) {
  if (!isOpen) return null

  return (
    <div className="fixed z-auto flex justify-center items-center bg-black/80 w-f max-h-dvh top-0 left-0 right-0 bottom-0">
      <div className="flex flex-col space-y-4 bg-white p-5 rounded-lg w-80 h-40">
        <h3 className="flex justify-center w-full text-black text-md font-bold">
          {title}
        </h3>
        <p className="text-black">{message}</p>
        <div className="flex space-x-4">
          <Button onClick={onClose} text="취소" />
          <Button onClick={onConfirm} text="확인" />
        </div>
      </div>
    </div>
  )
}
export default Modal
