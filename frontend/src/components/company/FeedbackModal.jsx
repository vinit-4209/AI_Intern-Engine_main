"use client"

function FeedbackModal({ open, candidateName, value, onChange, onClose, onSubmit }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-gray-900">Feedback for {candidateName}</h3>
        <p className="mt-1 text-sm text-gray-500">
          Share interview notes or hiring context to improve future AI recommendations.
        </p>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={5}
            placeholder="E.g. Strong technical foundation, schedule interview next week."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Save feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeedbackModal

