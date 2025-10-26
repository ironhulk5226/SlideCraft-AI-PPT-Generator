import React, { useState } from 'react'
import { Sparkles, X, Loader2 } from 'lucide-react'

const FloatingActionTool = ({position, onClose, loading, handleAiChange}) => {
    const [userInput, setUserInput] = useState('')
    const [showInput, setShowInput] = useState(false)

    const handleSubmit = () => {
        if (userInput.trim()) {
            handleAiChange(userInput)
            setUserInput('')
            setShowInput(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

  return (
    <div
    className='absolute z-50 bg-white text-gray-800 text-sm px-3 py-2 rounded-lg shadow-xl border-2 flex items-center gap-2' 
    style={{
        top: `${position.y + 8}px`, 
        left: `${position.x}px`,
        transform: "translate(-50%)",
        borderColor: "oklch(0.4585 0.2223 273.18 / 94.54%)"
    }}
    >
        {!showInput ? (
            <>
                <button 
                    onClick={() => setShowInput(true)}
                    className='flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors'
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className='w-4 h-4 animate-spin' style={{color: "oklch(0.4585 0.2223 273.18 / 94.54%)"}} />
                    ) : (
                        <Sparkles className='w-4 h-4' style={{color: "oklch(0.4585 0.2223 273.18 / 94.54%)"}} />
                    )}
                    <span className='font-medium'>AI Edit</span>
                </button>
                <button 
                    onClick={onClose}
                    className='p-1 hover:bg-gray-100 rounded transition-colors'
                >
                    <X className='w-4 h-4' />
                </button>
            </>
        ) : (
            <div className='flex items-center gap-2'>
                <input 
                    type='text'
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder='Describe your changes...'
                    className='border rounded px-2 py-1 text-sm w-64 focus:outline-none'
                    style={{borderColor: "oklch(0.4585 0.2223 273.18 / 94.54%)"}}
                    autoFocus
                    disabled={loading}
                />
                <button 
                    onClick={handleSubmit}
                    disabled={loading || !userInput.trim()}
                    className='px-3 py-1 rounded text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-1'
                    style={{backgroundColor: "oklch(0.4585 0.2223 273.18 / 94.54%)"}}
                >
                    {loading ? (
                        <>
                            <Loader2 className='w-4 h-4 animate-spin' />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <span>Apply</span>
                    )}
                </button>
                <button 
                    onClick={() => {
                        setShowInput(false)
                        setUserInput('')
                    }}
                    className='p-1 hover:bg-gray-100 rounded transition-colors'
                    disabled={loading}
                >
                    <X className='w-4 h-4' />
                </button>
            </div>
        )}
    </div>
  )
}

export default FloatingActionTool