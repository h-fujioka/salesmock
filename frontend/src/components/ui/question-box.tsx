"use client"

import { Button } from "@/components/ui/button"
import React from "react"

type QuestionBoxProps = {
  question: string
  onEdit: () => void
  isEditing: boolean
  editableQuestion: string
  setEditableQuestion: (v: string) => void
  onEditComplete: () => void
  variant?: "default" | "answer"
  showEdit?: boolean
}

export function QuestionBox({
  question,
  onEdit,
  isEditing,
  editableQuestion,
  setEditableQuestion,
  onEditComplete,
  variant = "default",
  showEdit = true
}: QuestionBoxProps) {
  const isAnswer = variant === "answer"
  return (
    <div
      className={
        isAnswer
          ? "bg-[#22223b] rounded-3xl px-8 py-6 w-fit text-xl text-white font-medium mb-4"
          : "w-full max-w-[1000px] mx-auto bg-gray-100 border border-gray-100 rounded-xl shadow px-4 py-3 flex items-center justify-between text-base font-normal text-gray-800 mb-4"
      }
      style={isAnswer ? { maxWidth: 1000, marginLeft: "auto" } : {}}
    >
      {isEditing ? (
        <input
          className={
            isAnswer
              ? "flex-1 bg-transparent outline-none border-none text-xl text-white font-medium mr-2 px-2 py-1 rounded"
              : "flex-1 bg-transparent outline-none border-none text-base font-normal text-gray-800 mr-2 px-2 py-1 rounded"
          }
          value={editableQuestion}
          onChange={(e) => setEditableQuestion(e.target.value)}
          onBlur={onEditComplete}
          onKeyDown={(e) => {
            if (e.key === "Enter") onEditComplete()
          }}
          autoFocus
        />
      ) : (
        <span className={isAnswer ? "whitespace-pre-wrap" : "truncate"}>
          {question}
        </span>
      )}
      {showEdit && !isAnswer && (
        <Button
          size="icon"
          variant="ghost"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10 ml-4"
          onClick={onEdit}
          aria-label="編集"
        >
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Button>
      )}
    </div>
  )
} 