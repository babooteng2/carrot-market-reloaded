"use client"
import Button from "@/components/button"
import Input from "@/components/input"
import { useFormState } from "react-dom"
import { smsLogIn } from "./actions"

export default function SMSLogin() {
  const initialState = {
    token: false,
    error: undefined,
  }
  const [state, dispatch] = useFormState(smsLogIn, initialState)
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login!</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        {state.token ? (
          <Input
            type="number"
            placeholder="Verification code"
            required
            name="token"
            min={100000}
            max={999999}
          />
        ) : (
          <Input
            type="text"
            placeholder="Phone number"
            required
            name="phone"
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? "Verify Token" : "Send Verification SMS"} />
      </form>
    </div>
  )
}
