"use client"

import { InitialChatMessages } from "@/app/chats/[id]/page"
import { formatToTimeAgo } from "@/lib/utils"
import { CogIcon, UserIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { useState } from "react"

interface ChatMessageListProps {
  userId: number
  initialMessages: InitialChatMessages
}
export default function ChatMessagesList({
  userId,
  initialMessages,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages)
  return (
    <div className={`flex flex-col gap-5 min-h-screen justify-end`}>
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
            className={`flex flex-col gap-1 ${message.userId === userId && "items-end"}`}
          >
            <span
              className={`${message.userId === userId ? "bg-neutral-500" : "bg-orange-500"} p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
