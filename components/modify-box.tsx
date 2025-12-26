"use client"

import Button from "@/components/button"
import Modal from "@/components/modal"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

export default function ModifyBox({
  postId,
  commentId,
  removeFunc,
  modifyFunc,
}: {
  postId: number
  commentId?: number
  removeFunc?: Function
  modifyFunc?: Function
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  const handleConfirm = () => {
    console.log("모달 확인 버튼 클릭")
    setIsModalOpen(false)
    if (removeFunc) {
      removeFunc(postId, commentId)
      //removePostComment(id, postId)
    }
  }
  const handleModifyContent = () => {
    if (modifyFunc) {
      modifyFunc(postId, commentId)
      //modifyPostComment(id, postId)
    }
  }
  return (
    <div className="flex space-x-2">
      <div className="flex w-20">
        <Button onClick={() => handleModifyContent()} text="수정" />
      </div>
      <button onClick={() => handleOpenModal()}>
        <XMarkIcon className="size-7" />
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title="확인"
        message="삭제하시겠습니까?"
      />
    </div>
  )
}
