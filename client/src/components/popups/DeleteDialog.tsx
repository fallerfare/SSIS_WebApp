import { Box, Button } from "@chakra-ui/react"
import type { Student } from "@/models/types/students"
import type { Program } from "@/models/types/programs"
import type { College } from "@/models/types/colleges"

type DeleteModalProps<T> = {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode 
  deleteData?: T
  onConfirm?: (data: T) => void
}

export default function DeleteModal<T extends Student | Program | College>(
                                                { isOpen, onClose, deleteData, onConfirm }:
                                                DeleteModalProps<T> ) {
  console.log(deleteData)

  if (!isOpen || !deleteData) return null

  let content: React.ReactNode = null
  let header: React.ReactNode = null

  if ("id_number" in deleteData){
    const student = deleteData as Student
    console.log("Student view chosen")
    content = (
      <Box>        
        Are you sure you want to delete this student?
      </Box>
    )
    header = (
      <Box className="view-head-card">
          <h1>{student.id_number}</h1>
      </Box>
    )
  }
  else if ("program_code" in deleteData){
    const program = deleteData as Program
    content = (
      <p>Pogram Code: {program.program_code}</p>  
    )
  }

   else  if ("college_name" in deleteData){
      const college = deleteData as College
      content = (
        <p>College Code: {college.college_code}</p>  
      )
    }

  const handleConfirm = () => {
      if (onConfirm) onConfirm(deleteData)
      onClose()
  }

  return (
        <Box className="viewpopup-overlay">
            <Box className="viewpopup-content">
                {header}
                {content}
                <Box className="dialog-buttons">
                  <Button type="submit" className="submit-button" onClick={handleConfirm}>
                    Confirm Delete
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

