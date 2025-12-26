import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline"

interface IPostCommentCountProps {
  viewCount: number
}

export default function PostCommentCount({
  viewCount,
}: IPostCommentCountProps) {
  return (
    <div className="flex space-x-2">
      <ChatBubbleLeftIcon className="size-5" />
      <span>{viewCount}</span>
    </div>
  )
}
