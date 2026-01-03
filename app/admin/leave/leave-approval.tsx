'use client'

import { useState } from 'react'
import { approveLeaveRequest, rejectLeaveRequest } from '@/app/actions/leave'
import { useRouter } from 'next/navigation'

export function LeaveApprovalActions({ requestId }: { requestId: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  async function handleApprove() {
    if (!showComment) {
      setShowComment(true)
      setAction('approve')
      return
    }

    setLoading(true)
    try {
      await approveLeaveRequest(requestId, comment || undefined)
      router.refresh()
    } catch (error) {
      alert('Failed to approve leave request')
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    if (!showComment) {
      setShowComment(true)
      setAction('reject')
      return
    }

    setLoading(true)
    try {
      await rejectLeaveRequest(requestId, comment || undefined)
      router.refresh()
    } catch (error) {
      alert('Failed to reject leave request')
    } finally {
      setLoading(false)
    }
  }

  if (showComment) {
    return (
      <div className="flex flex-col gap-2 w-64">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment (optional)..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          <button
            onClick={action === 'approve' ? handleApprove : handleReject}
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
              action === 'approve'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? 'Processing...' : action === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
          </button>
          <button
            onClick={() => {
              setShowComment(false)
              setComment('')
              setAction(null)
            }}
            className="py-2 px-4 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
      >
        Approve
      </button>
      <button
        onClick={handleReject}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
      >
        Reject
      </button>
    </div>
  )
}

