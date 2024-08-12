"use server"

export async function uploadProduct(formData: FormData) {
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    photo: formData.get("photo"),
    description: formData.get("description"),
  }
  console.log(data)
}
