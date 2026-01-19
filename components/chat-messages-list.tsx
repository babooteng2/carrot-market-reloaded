"use client"

import { InitialChatMessages } from "@/app/chats/[id]/page"
import { storeMessage } from "@/app/chats/actions"
import { TuserProfile } from "@/lib/db"
import { formatToTimeAgo } from "@/lib/utils"
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/outline"
import { createClient, RealtimeChannel } from "@supabase/supabase-js"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface ChatMessageListProps {
  chatRoomId: string
  profile: TuserProfile
  initialMessages: InitialChatMessages
}
export default function ChatMessagesList({ chatRoomId, profile, initialMessages }: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [message, setMessage] = useState("")
  const userId = profile!.id
  const username = profile!.username
  const avatar = profile!.avatar ?? ""
  const channel = useRef<RealtimeChannel>()
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event
    setMessage(value)
  }
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessages(prevMsgs => [
      ...prevMsgs,
      {
        user: {
          username,
          avatar,
        },
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
      },
    ])
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        user: {
          username,
          avatar,
        },
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
      },
    })
    await storeMessage(message, chatRoomId)
    setMessage("")
  }
  useEffect(() => {
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!)
    channel.current = client.channel(`room-${chatRoomId}`)
    channel.current
      .on("broadcast", { event: "message" }, payload => {
        setMessages(prevMsgs => [...prevMsgs, payload.payload])
      })
      .subscribe()
    return () => {
      channel.current?.unsubscribe()
    }
  }, [])

  return (
    <div
      className={`flex flex-col max-w-full
        gap-5
        min-h-screen
        justify-end
    `}>
      {messages.map(message => (
        <div
          key={message.id}
          className={`
            flex
            items-start
            gap-2
            ${message.userId === userId && "justify-end"}

        `}>
          {userId !== message.userId &&
            (message.user.avatar !== null && message.user.avatar !== "" ? (
              <Image
                width={50}
                height={50}
                className="
                  rounded-full
                  size-8
                "
                src={message.user.avatar || ""}
                alt={message.user.username}
              />
            ) : (
              <div
                className="
                  flex
                  items-center
                  justify-center
                  rounded-full
                  size-10
                  ring-1
                  ring-white
                ">
                <UserIcon
                  className="
                    size-8
                  "
                />
              </div>
            ))}

          <div
            className={`
              flex
              flex-col
              gap-1
              ${message.userId === userId && "items-end"}
              max-w-full
          `}>
            <span
              className={`
                ${message.userId === userId ? "bg-neutral-500" : "bg-orange-500"}
                inline-block
                max-w-full
                rounded-md
                p-2.5
                text-wrap
                whitespace-normal
                break-words
            `}>
              {message.payload}
            </span>
            <span
              className="
                text-xs
              ">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form
        className="
          flex
          relative
        "
        onSubmit={onSubmit}>
        <input
          type="text"
          className="
            w-full
            transition
            rounded-full
            bg-transparent
            h-10
            px-5
            ring-2
            ring-neutral-200
            border-none
            focus:outline-none
            focus:ring-4
            focus:ring-neutral-50
            placeholder:text-neutral-400
          "
          required
          onChange={onChange}
          value={message}
          placeholder="Write a message..."
        />
        <button
          className="
            absolute
            right-0
          ">
          <ArrowUpCircleIcon
            className="
              size-10
              text-orange-500
              transition-colors
              hover:text-orange-300
            "
          />
        </button>
      </form>
    </div>
  )
}
