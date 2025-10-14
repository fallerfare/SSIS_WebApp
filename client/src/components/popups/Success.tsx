import { Box, Button } from "@chakra-ui/react"

type SuccessPopupProps = {
  isOpen: boolean
  onClose: () => void
  message: string
}

export default function SuccessPopup({ isOpen, onClose, message }: SuccessPopupProps) {
  
  if (!isOpen) return null
  
  return (
    <Box className="viewpopup-overlay">
      <Box className="viewpopup-content">
        <Box className="view-head-card">
          <h1>SUCCESS</h1>
        </Box>
        <Box className="text-label">        
          {message || "Action successfully executed."}        
        </Box>

        <Box className="dialog-buttons">
          <Button type="reset" className="auth-button" onClick={onClose}>
            Okay
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
