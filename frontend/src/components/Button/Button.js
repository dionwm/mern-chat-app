import React from 'react'
import './Button.css'

export default function Button({btnName, isPrimary, onClick, isLoading}) {
  return (
    <>
      <button 
        disabled={isLoading}
        className={isPrimary ? "btn btn-primary" : "btn btn-secondary"}
        onClick={onClick}
      >
          {btnName}
      </button>
    </>
  )
}
