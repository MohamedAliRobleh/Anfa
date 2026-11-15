import { useEffect, useRef, useState } from 'react'
import { MEDIA_SLOTS } from '../../content/mediaSlots'
import { fetchMediaOverrides, uploadMedia, saveMediaOverride, resetMediaOverride } from '../../lib/mediaOverrides'
import { useMediaOverridesContext } from '../../media/MediaOverridesProvider'

function UploadIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M12 15V4M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// A drag-and-drop zone (plus a plain file picker as fallback) for one slot.
// Deliberately uses only the native HTML5 drag-and-drop API — no library.
function Dropzone({ onFile, disabled }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFiles(fileList) {
    const file = fileList?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragOver(false)
        if (!disabled) handleFiles(event.dataTransfer.files)
      }}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors duration-200 ${
        dragOver ? 'border-sea bg-mist/60' : 'border-ink/15'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <UploadIcon className="h-5 w-5 text-sea-deep" />
      <p className="text-sm text-ink/70">
        Glissez une photo ici, ou{' '}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="font-semibold text-sea-deep underline hover:text-sea"
        >
          choisissez un fichier
        </button>
      </p>
      <p className="text-xs text-ink/40">JPG, PNG, WEBP ou GIF — 5 Mo maximum</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />
    </div>
  )
}

function MediaSlotCard({ slot, override, onSaved, onReset }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [altFr, setAltFr] = useState(override?.altFr || '')
  const [altEn, setAltEn] = useState(override?.altEn || '')
  const [status, setStatus] = useState('idle') // idle | saving | resetting | success | error
  const [message, setMessage] = useState('')

  // If the override changes from outside this card (e.g. reset), keep the
  // alt text fields in sync with it.
  useEffect(() => {
    setAltFr(override?.altFr || '')
    setAltEn(override?.altEn || '')
  }, [override?.altFr, override?.altEn])

  // Revoke the object URL whenever it changes or the card unmounts, so we
  // never leak memory from abandoned previews.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFile(nextFile) {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(nextFile)
    setPreviewUrl(URL.createObjectURL(nextFile))
    setStatus('idle')
    setMessage('')
  }

  function cancelPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl('')
  }

  async function handleConfirm() {
    if (!file) return
    setStatus('saving')
    setMessage('')
    try {
      const url = await uploadMedia(slot.key, file)
      await saveMediaOverride(slot.key, { url, altFr, altEn })
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setFile(null)
      setPreviewUrl('')
      setStatus('success')
      setMessage('Photo mise à jour avec succès.')
      onSaved(slot.key, { url, altFr, altEn })
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Une erreur est survenue. Veuillez réessayer.')
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      `Réinitialiser « ${slot.label} » à l’image d’origine ? Vous pourrez toujours la remplacer à nouveau plus tard.`
    )
    if (!confirmed) return
    setStatus('resetting')
    setMessage('')
    try {
      await resetMediaOverride(slot.key)
      setStatus('idle')
      setMessage('')
      onReset(slot.key)
    } catch {
      setStatus('error')
      setMessage('Impossible de réinitialiser cette image. Veuillez réessayer.')
    }
  }

  const effectiveUrl = previewUrl || override?.url || slot.defaultUrl
  const hasOverride = Boolean(override?.url)
  const busy = status === 'saving' || status === 'resetting'

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <div className="flex gap-4">
        <img src={effectiveUrl} alt={slot.label} className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-ink/10" />
        <div className="min-w-0">
          <h3 className="font-display text-base text-ink">{slot.label}</h3>
          <p className="mt-0.5 text-xs text-ink/50">{slot.where}</p>
          {hasOverride && (
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-lavender-soft px-2.5 py-0.5 text-[11px] font-semibold text-sea-deep">
              Photo personnalisée
            </span>
          )}
        </div>
      </div>

      {!file ? (
        <Dropzone onFile={handleFile} disabled={busy} />
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-mist/50 p-3">
          <img src={previewUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink/80">{file.name}</p>
            <p className="text-xs text-ink/50">Aperçu avant l’enregistrement</p>
          </div>
        </div>
      )}

      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-ink/60 hover:text-ink">
          Description de l’image (pour l’accessibilité et les moteurs de recherche)
        </summary>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/50" htmlFor={`alt-fr-${slot.key}`}>
              Français
            </label>
            <input
              id={`alt-fr-${slot.key}`}
              type="text"
              value={altFr}
              onChange={(event) => setAltFr(event.target.value)}
              placeholder="Ex. : Sahra souriant dans son bureau"
              className="w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-sm focus:border-sea focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/50" htmlFor={`alt-en-${slot.key}`}>
              Anglais
            </label>
            <input
              id={`alt-en-${slot.key}`}
              type="text"
              value={altEn}
              onChange={(event) => setAltEn(event.target.value)}
              placeholder="E.g.: Sahra smiling in her office"
              className="w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-sm focus:border-sea focus:outline-none"
            />
          </div>
        </div>
      </details>

      {message && (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={`text-sm font-medium ${status === 'error' ? 'text-red-600' : 'text-sea-deep'}`}
        >
          {message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {file && (
          <>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={busy}
              className="rounded-full bg-sea-deep px-4 py-2 text-sm font-semibold text-sand transition-colors duration-300 hover:bg-sea disabled:opacity-60"
            >
              {status === 'saving' ? 'Enregistrement…' : 'Confirmer le remplacement'}
            </button>
            <button type="button" onClick={cancelPreview} disabled={busy} className="text-sm font-semibold text-ink/50 hover:text-ink">
              Annuler
            </button>
          </>
        )}
        {hasOverride && !file && (
          <button
            type="button"
            onClick={handleReset}
            disabled={busy}
            className="text-sm font-semibold text-ink/50 underline hover:text-ink disabled:opacity-60"
          >
            {status === 'resetting' ? 'Réinitialisation…' : 'Réinitialiser à l’image d’origine'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function MediaManager() {
  const ctx = useMediaOverridesContext()
  const [overrides, setOverrides] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchMediaOverrides().then((data) => {
      if (!active) return
      setOverrides(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  function handleSaved(slotKey, entry) {
    setOverrides((prev) => ({ ...prev, [slotKey]: entry }))
    ctx?.refresh?.()
  }

  function handleReset(slotKey) {
    setOverrides((prev) => {
      const next = { ...prev }
      delete next[slotKey]
      return next
    })
    ctx?.refresh?.()
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-sea-deep">Images du site</h1>
      <p className="mt-2 max-w-2xl text-ink/60">
        Remplacez n’importe quelle photo du site : faites-la glisser sur une carte, ou cliquez pour en choisir une sur
        votre ordinateur. Vous pourrez toujours revenir à la photo d’origine en un clic.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-ink/50">Chargement des images…</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {MEDIA_SLOTS.map((slot) => (
            <MediaSlotCard key={slot.key} slot={slot} override={overrides[slot.key]} onSaved={handleSaved} onReset={handleReset} />
          ))}
        </div>
      )}
    </div>
  )
}
