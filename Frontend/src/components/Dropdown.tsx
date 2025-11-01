import { useState, useRef, useEffect } from 'react'
import './Dropdown.css'

interface DropdownOption {
  id: number
  label: string
  value: any
}

interface DropdownProps {
  options: DropdownOption[]
  selected: number | null
  onSelect: (id: number, value: any) => void
  placeholder?: string
  label?: string
  disabled?: boolean
}

export default function Dropdown({
  options,
  selected,
  onSelect,
  placeholder = 'Selecione uma opção',
  label,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.id === selected)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (option: DropdownOption) => {
    onSelect(option.id, option.value)
    setIsOpen(false)
  }

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      {label && <label className="dropdown-label">{label}</label>}
      <div
        className={`dropdown-button ${isOpen ? 'open' : ''} ${
          disabled ? 'disabled' : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="dropdown-button-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M6 9L1 4h10z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>
      {isOpen && !disabled && (
        <div className="dropdown-menu">
          {options.length === 0 ? (
            <div className="dropdown-item empty">Nenhuma opção disponível</div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
                className={`dropdown-item ${
                  selected === option.id ? 'selected' : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

