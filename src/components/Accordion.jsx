import { useState } from 'react'
import { ChevronDownIcon } from './icons'

export function Accordion({ items }) {
  const [openId, setOpenId] = useState(null)
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            className={`rounded-2xl bg-white shadow-sm ring-1 transition-shadow duration-300 ${
              isOpen ? 'ring-sea-deep/20 shadow-md' : 'ring-ink/5'
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`panel-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-lg text-sea-deep"
            >
              {item.question}
              <ChevronDownIcon
                className={`h-4 w-4 shrink-0 text-sea-deep transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <p id={`panel-${item.id}`} className="px-5 pb-4 text-sm text-ink/75">
                {item.answer}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
