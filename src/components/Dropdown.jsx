/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
export function Dropdown({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => {
          const resolvedValue = option.symbol || option
          return (
            <option key={resolvedValue} value={resolvedValue}>
              {option.label || option}
            </option>
          )
        })}
      </select>
    </label>
  )
}
