import { Box, Button } from "@chakra-ui/react"

type LogOutModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
}

export default function LogOutModal(
                                                { isOpen, onClose, onConfirm }:
                                                LogOutModalProps) {

  if (!isOpen) return null
    
  const handleConfirm = (e: React.FormEvent) => {
      e.preventDefault()
      if (onConfirm) onConfirm()
      onClose()
  }

  return (
        <Box className="viewpopup-overlay">
            <Box className="viewpopup-content">
                <Box className="view-head-card">
                    <h1>Log Out</h1>
                </Box>
                <Box className="text-label">        
                    Are you sure you want to log out?
                </Box>
                <Box className="dialog-buttons">
                  <Button type="submit" className="submit-button" onClick={handleConfirm}>
                    Log out
                  </Button>
                  <Button type="reset" className="auth-button" onClick={onClose}>
                    Cancel
                  </Button>
                </Box>
                <button
                  onClick={onClose}
                  className="viewpopup-close"
                >
                  ✕
                </button>
            </Box>
        </Box>
  )
}

