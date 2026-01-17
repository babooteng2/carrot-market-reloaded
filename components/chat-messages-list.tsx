"use client"

import { InitialChatMessages } from "@/app/chats/[id]/page"
import { formatToTimeAgo } from "@/lib/utils"
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/outline"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ChatMessageListProps {
  chatRoomId: string
  userId: number
  initialMessages: InitialChatMessages
}
export default function ChatMessagesList({
  chatRoomId,
  userId,
  initialMessages,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [message, setMessage] = useState("")
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event
    setMessage(value)
  }
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        user: {
          username: "string",
          avatar: "xxx",
        },
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
      },
    ])
    setMessage("")
  }
  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!
    )
    const channel = client.channel(`room-${chatRoomId}`)
    channel.on("broadcast", { event: "message" }, (payload) => {
      console.log(payload)
    })
  }, [])

  return (
    <div className={`flex flex-col gap-5 min-h-screen justify-end max-w-full`}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${message.userId === userId && "justify-end"}`}
        >
          {userId != message.userId &&
            (message.user.avatar != null ? (
              <Image
                className="size-8 rounded-full"
                src={message.user.avatar}
                alt={message.user.username}
              />
            ) : (
              <div className="flex size-10 rounded-full ring-1 ring-white justify-center items-center">
                <UserIcon className="size-8 " />
              </div>
            ))}

          <div
            className={`flex flex-col gap-1 ${message.userId === userId && "items-end"} max-w-full`}
          >
            <span
              className={`${message.userId === userId ? "bg-neutral-500" : "bg-orange-500"} p-2.5 rounded-md inline-block text-wrap whitespace-normal break-words max-w-full`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          type="text"
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          required
          onChange={onChange}
          value={message}
          placeholder="Write a message..."
        />
        <button className="abolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  )
}
