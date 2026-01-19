"use server"
import { saveMessage } from "@/lib/db"

export async function storeMessage(payload: string, chatRoomId: string) {
  const result = await saveMessage(payload, chatRoomId)
  return result
}
