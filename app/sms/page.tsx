"use client"
import Button from "@/components/button"
import Input from "@/components/input"
import { useFormState } from "react-dom"
import { sms } from "./actions"

export default function SMSLogin() {
  const [state, action] = useFormState(sms, null)
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login!</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form className="flex flex-col gap-3" action={action}>
        <Input
          type="number"
          placeholder="Phone number"
          required
          name="phone"
          errors={state?.fieldErrors.phone}
        />
        <Input
          type="number"
          placeholder="Verification code"
          required
          name="verification"
          errors={state?.fieldErrors.verification}
        />
        <Button text="Verify" />
      </form>
    </div>
  )
}
