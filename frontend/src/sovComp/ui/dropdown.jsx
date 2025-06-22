"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export function Dropdown({ trigger, children, align = "left", className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div className={`absolute top-full mt-1 z-50 ${alignmentClasses[align]} ${className}`}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-48">{children}</div>
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export function Select({ options, value, onChange, placeholder = "Select option...", className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((option) => option.value === value)

  return (
    <Dropdown
      trigger={
        <button
          className={`w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors ${className}`}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      }
      className="w-full"
    >
      {options.map((option) => (
        <DropdownItem
          key={option.value}
          onClick={() => {
            onChange(option.value)
            setIsOpen(false)
          }}
          className={value === option.value ? "bg-blue-50 text-blue-600" : ""}
        >
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  )
}
