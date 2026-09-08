import { useState, type FormEvent } from 'react'

import { Button } from '../../components/ui/Button.tsx'
import { Panel } from '../../components/ui/Panel.tsx'
import { TextField } from '../../components/ui/TextField.tsx'
import type { TodoDraft } from './todo.ts'

interface QuickAddTodoProps {
  onAdd: (draft: TodoDraft) => Promise<void>
}

export function QuickAddTodo({ onAdd }: QuickAddTodoProps) {
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const trimmedTitle = title.trim()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!trimmedTitle) {
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await onAdd({
        title: trimmedTitle,
        description: description.trim() || null,
      })
      setTitle('')
      setDescription('')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'The todo could not be created.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Panel
      description="Capture a work item and add it to the open board."
      title="Quick add"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          maxLength={255}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          value={title}
        />
        <TextField
          label="Description"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add helpful context (optional)"
          value={description}
        />
        {error ? (
          <p
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <Button
          className="w-full"
          disabled={!trimmedTitle || isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Adding todo...' : 'Add to open work'}
        </Button>
      </form>
    </Panel>
  )
}
