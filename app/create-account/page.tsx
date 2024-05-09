"use client"
import FormButton from "@/components/form-btn"
import FormInput from "@/components/form-input"
import SocialLogin from "@/components/social-login"
import { useFormState } from "react-dom"
import { createAccount } from "./actions"

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null)
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput
          type="text"
          placeholder="Username"
          required
          name="userName"
        />
        <FormInput type="email" placeholder="Email" required name="email" />
        <FormInput
          type="password"
          placeholder="Password"
          required
          name="password"
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          required
          name="confirmPassword"
        />
        <FormButton text="Create account" />
      </form>
      <SocialLogin />
    </div>
  )
}
