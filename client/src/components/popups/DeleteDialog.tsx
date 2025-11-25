import { Box, Button } from "@chakra-ui/react"
import type { Student } from "@/models/types/students"
import type { Program } from "@/models/types/programs"
import type { College } from "@/models/types/colleges"
import type { UserData } from "@/models/types/UserData"

type DeleteModalProps<T> = {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode 
  deleteData?: T
  onConfirm?: (data: T) => void
}

export default function DeleteModal<T extends Student | Program | College | UserData>(
                                                { isOpen, onClose, deleteData, onConfirm }:
                                                DeleteModalProps<T> ) {

  if (!isOpen || !deleteData) return null

  let content: React.ReactNode = null
  let header: React.ReactNode = null

  if ("id_number" in deleteData){
    const student = deleteData as Student
    content = (
      <Box className="text-label">        
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
      <Box className="text-label">        
        Are you sure you want to delete this program?
      </Box>
    )
    header = (
      <Box className="view-head-card">
          <h1>{program.program_code}</h1>
      </Box>
    )
  }

   else  if ("college_name" in deleteData){
    const college= deleteData as College
    content = (
      <Box className="text-label">        
        Are you sure you want to delete this college?
      </Box>
    )
    header = (
      <Box className="view-head-card">
          <h1>{college.college_code}</h1>
      </Box>
    )
    }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
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

