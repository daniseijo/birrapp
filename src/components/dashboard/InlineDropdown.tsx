import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface InlineDropdownProps {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  className?: string
}

export const InlineDropdown: React.FC<InlineDropdownProps> = ({ value, options, onChange, className }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <span className="relative inline-block align-baseline" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1 border-b-2 border-muted-foreground/40 hover:border-muted-foreground transition-colors cursor-pointer bg-transparent px-0 py-0 font-inherit text-inherit ${className || ''}`}
      >
        {selectedOption?.label || value}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <span className="absolute top-full left-0 mt-1 min-w-35 bg-popover border border-border rounded-lg shadow-lg py-1 z-50 block">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors cursor-pointer block ${
                option.value === value ? 'bg-accent font-medium' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </span>
      )}
    </span>
  )
}
