"use client"

import { HTMLAttributes, MouseEventHandler } from "react"
import { useFormStatus } from "react-dom"

interface ButtonProps {
  text: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function Button({
  text,
  onClick,
  className,
  ...rest
}: ButtonProps & HTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus()
  const baseClasses =
    "primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
  const combinedClasses = `${baseClasses} ${className || ""}`

  return (
    <button
      disabled={pending}
      className={combinedClasses}
      onClick={onClick}
      {...rest}
    >
      {pending ? "Loading..." : text}
    </button>
  )
}
