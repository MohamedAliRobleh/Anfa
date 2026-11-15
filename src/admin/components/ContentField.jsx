import { useState } from 'react'
import { saveContentOverride, resetContentOverride } from '../../lib/contentOverrides'
import { getDefaultText } from './contentDefaults'

// One editable text field: a French value and an English value, pre-filled
// with whatever is currently shown on the live site (a saved override if one
// exists, otherwise the built-in default). Save/Cancel/Reset only appear
// once the assistant has actually changed something, or the field already
// has a saved override — untouched fields stay quiet so 235 of them don't
// turn the page into a wall of buttons.
export function ContentField({ fieldKey, label, multiline, initialOverride }) {
  const defaultFr = getDefaultText(fieldKey, 'fr')
  const defaultEn = getDefaultText(fieldKey, 'en')

  const initialFr = initialOverride?.fr?.trim() ? initialOverride.fr : defaultFr
  const initialEn = initialOverride?.en?.trim() ? initialOverride.en : defaultEn

  const [savedFr, setSavedFr] = useState(initialFr)
  const [savedEn, setSavedEn] = useState(initialEn)
  const [fr, setFr] = useState(initialFr)
  const [en, setEn] = useState(initialEn)
  const [hasOverride, setHasOverride] = useState(Boolean(initialOverride))
  const [status, setStatus] = useState('idle') // idle | saving | saved | resetting | reset | error
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmingReset, setConfirmingReset] = useState(false)

  const dirty = fr !== savedFr || en !== savedEn
  const showActions = dirty || hasOverride
  const Field = multiline ? 'textarea' : 'input'
  const frId = `content-field-${fieldKey}-fr`
  const enId = `content-field-${fieldKey}-en`

  function handleChangeFr(event) {
    setFr(event.target.value)
    setStatus('idle')
    setErrorMessage('')
  }

  function handleChangeEn(event) {
    setEn(event.target.value)
    setStatus('idle')
    setErrorMessage('')
  }

  function handleCancel() {
    setFr(savedFr)
    setEn(savedEn)
    setStatus('idle')
    setErrorMessage('')
  }

  async function handleSave() {
    setStatus('saving')
    setErrorMessage('')
    const trimmedFr = fr.trim()
    const trimmedEn = en.trim()
    try {
      await saveContentOverride(fieldKey, { valueFr: trimmedFr, valueEn: trimmedEn })
      setFr(trimmedFr)
      setEn(trimmedEn)
      setSavedFr(trimmedFr)
      setSavedEn(trimmedEn)
      setHasOverride(true)
      setConfirmingReset(false)
      setStatus('saved')
    } catch {
      setStatus('error')
      setErrorMessage('Une erreur est survenue pendant l’enregistrement. Vos modifications n’ont pas été perdues — veuillez réessayer.')
    }
  }

  async function handleReset() {
    if (!confirmingReset) {
      setConfirmingReset(true)
      return
    }
    setConfirmingReset(false)
    setStatus('resetting')
    setErrorMessage('')
    try {
      await resetContentOverride(fieldKey)
      setFr(defaultFr)
      setEn(defaultEn)
      setSavedFr(defaultFr)
      setSavedEn(defaultEn)
      setHasOverride(false)
      setStatus('reset')
    } catch {
      setStatus('error')
      setErrorMessage('Une erreur est survenue pendant la réinitialisation. Veuillez réessayer.')
    }
  }

  const fieldClasses =
    'w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm text-ink focus:border-sea focus:outline-none focus:ring-1 focus:ring-sea/30'

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink/90 sm:text-base">{label}</h3>
        {hasOverride && (
          <span className="shrink-0 rounded-full bg-lavender-soft px-2.5 py-1 text-xs font-semibold text-lavender-ink">
            Texte personnalisé
          </span>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={frId} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Texte en français
          </label>
          <Field
            id={frId}
            value={fr}
            onChange={handleChangeFr}
            rows={multiline ? 4 : undefined}
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor={enId} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Texte en anglais
          </label>
          <Field
            id={enId}
            value={en}
            onChange={handleChangeEn}
            rows={multiline ? 4 : undefined}
            className={fieldClasses}
          />
        </div>
      </div>

      {errorMessage && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}
      {status === 'saved' && !dirty && (
        <p className="mt-3 text-sm font-medium text-green-700">Enregistré.</p>
      )}
      {status === 'reset' && (
        <p className="mt-3 text-sm font-medium text-green-700">Texte d’origine restauré.</p>
      )}

      {showActions && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-3">
          {dirty && (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={status === 'saving'}
                className="rounded-full bg-sea-deep px-4 py-2 text-sm font-semibold text-sand transition-colors duration-200 hover:bg-sea disabled:opacity-60"
              >
                {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={status === 'saving'}
                className="text-sm font-semibold text-ink/50 hover:text-ink"
              >
                Annuler
              </button>
            </>
          )}

          {hasOverride && !confirmingReset && (
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-ink/50 underline underline-offset-2 hover:text-ink"
            >
              Réinitialiser (revenir au texte d’origine)
            </button>
          )}
          {hasOverride && confirmingReset && (
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-ink/60">Revenir au texte d’origine pour ce champ ?</span>
              <button
                type="button"
                onClick={handleReset}
                disabled={status === 'resetting'}
                className="rounded-full bg-red-50 px-3.5 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                {status === 'resetting' ? 'Réinitialisation…' : 'Oui, réinitialiser'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="text-sm font-semibold text-ink/50 hover:text-ink"
              >
                Non, garder mon texte
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
