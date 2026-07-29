export function Honeypot({ name, value, onChange, testId }) {
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
      <label htmlFor={name}>Website</label>
      <input
        id={name}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
        data-testid={testId}
      />
    </div>
  )
}
