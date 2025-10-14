import { Box, Button } from "@chakra-ui/react"
import ReactDOM from "react-dom"

type ErrorPopupProps = {
  isOpen: boolean
  onClose: () => void
  message: string
}

export default function ErrorPopup({ isOpen, onClose, message }: ErrorPopupProps) {
  
  if (!isOpen) return null

  console.log(message)
  
  return ReactDOM.createPortal(
    <Box className="viewpopup-overlay">
      <Box className="viewpopup-content">
        <Box className="view-head-card">
          <h1>ERROR ERROR ERROR</h1>
        </Box>
        <Box className="text-label" whiteSpace="pre-line">        
          {message || "An unexpected database error occurred."}        
        </Box>

        <Box className="dialog-buttons">
          <Button type="reset" className="auth-button" onClick={onClose}>
            Close
          </Button>
        </Box>

        <button 
          onClick={onClose} 
          className="viewpopup-close"
          >
            ✕
        </button>
      </Box>
    </Box>,
    document.body
  )
}
