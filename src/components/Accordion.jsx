import { useState } from 'react'

export function Accordion({ items }) {
  const [openId, setOpenId] = useState(null)
  return (
    <div className="divide-y divide-mist">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`panel-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full text-left py-4 font-display text-lg flex justify-between"
            >
              {item.question}
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <p id={`panel-${item.id}`} className="pb-4 text-sm">{item.answer}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
