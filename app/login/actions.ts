"use server"

export async function handleForm(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  console.log(
    "i run in the server only baby",
    formData.get("email"),
    formData.get("password")
  )
  console.log("in server", prevState)
  return {
    errors: ["wrong password", "password too short"],
  }
}
