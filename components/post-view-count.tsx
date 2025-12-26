import { EyeIcon } from "@heroicons/react/24/outline"

interface IPostViewCountProps {
  viewCount: number
}

export default function PostViewCount({ viewCount }: IPostViewCountProps) {
  return (
    <div className="flex space-x-2">
      <EyeIcon className="size-5" />
      <span>{viewCount}</span>
    </div>
  )
}
