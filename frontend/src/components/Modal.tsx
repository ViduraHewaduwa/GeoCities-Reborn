import { useEffect } from 'react'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

interface InputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: string) => void
  title: string
  label: string
  defaultValue?: string
  placeholder?: string
}

export function InputModal({ isOpen, onClose, onSubmit, title, label, defaultValue = '', placeholder }: InputModalProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue)
    }
  }, [isOpen, defaultValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{label}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            OK
          </button>
        </div>
      </form>
    </Modal>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="confirm-message">{message}</p>
      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>
          {cancelText}
        </button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={handleConfirm}>
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'info' | 'success' | 'error'
}

export function AlertModal({ isOpen, onClose, title, message, type = 'info' }: AlertModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={`alert-content alert-${type}`}>
        <span className="alert-icon">{getIcon()}</span>
        <p>{message}</p>
      </div>
      <div className="modal-actions">
        <button className="btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </Modal>
  )
}

interface FileActionsModalProps {
  isOpen: boolean
  onClose: () => void
  fileName: string
  onRename: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function FileActionsModal({ isOpen, onClose, fileName, onRename, onDelete, onDuplicate }: FileActionsModalProps) {
  const handleAction = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`File: ${fileName}`}>
      <div className="file-actions-list">
        <button className="action-item" onClick={() => handleAction(onRename)}>
          <span className="action-icon">✏️</span>
          <span>Rename</span>
        </button>
        <button className="action-item" onClick={() => handleAction(onDuplicate)}>
          <span className="action-icon">📋</span>
          <span>Duplicate</span>
        </button>
        <button className="action-item danger" onClick={() => handleAction(onDelete)}>
          <span className="action-icon">🗑️</span>
          <span>Delete</span>
        </button>
      </div>
    </Modal>
  )
}

// Add useState import
import { useState } from 'react'
