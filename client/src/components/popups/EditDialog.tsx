import { Box, Button, Grid, GridItem, Input } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import type { Student } from "@/models/types/students"
import type { Program } from "@/models/types/programs"
import type { College } from "@/models/types/colleges"
import { useState } from "react"

type EditModalProps<T> = {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode 
  editData?: T
  onConfirm?: (updated: T) => void
}

export default function EditModal<T extends Student | Program | College>(
                                                { isOpen, onClose, editData, onConfirm }:
                                                EditModalProps<T> ) {
  console.log(editData)

  if (!isOpen || !editData) return null

  let content: React.ReactNode = null
  let header: React.ReactNode = null

  if ("id_number" in editData){
    const student = editData as Student

    const [formData, setFormData] = useState<Student>(editData)

    const handleChange = (field: keyof Student) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value})
    }

    const handleConfirm = () => {
      if (onConfirm) {
        onConfirm(formData as T)
      }
      onClose()
    }
    console.log("Student view chosen")
    content = (
      <Box>        
        <Grid
            templateColumns="repeat(4, 1fr)" 
            gap={6}>
          <GridItem colStart={1} rowStart={1} colSpan={2}>
          <FormControl>
            <FormLabel className="text-label">First Name</FormLabel>
            <Input value={formData.first_name} 
                      className="text-box"
                      onChange={handleChange("first_name")}/>
          </FormControl>
        </GridItem>

        <GridItem colStart={3} rowStart={1} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Middle Name</FormLabel>
            <Input value={formData.middle_name}
                     className="text-box" 
                     onChange={handleChange("middle_name")}/>
          </FormControl>
        </GridItem>

        <GridItem colStart={4} rowStart={1} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Last Name</FormLabel>
            <Input value={formData.last_name} 
                      className="text-box"
                      onChange={handleChange("last_name")}/>
          </FormControl>
        </GridItem>

        <GridItem colStart={1} rowStart={2} colSpan={4}>
          <FormControl>
            <FormLabel className="text-label">Email</FormLabel>
            <Input value={formData.email} 
                      className="text-box"
                      onChange={handleChange("email")}/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={1} rowStart={3} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Gender</FormLabel>
            <Input value={formData.gender} 
                      className="text-box"
                      onChange={handleChange("gender")}/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={2} rowStart={3} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Year Level</FormLabel>
            <Input value={formData.year_level} 
                      className="text-box"
                      onChange={handleChange("year_level")}/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={1} rowStart={4} colSpan={2}>
          <FormControl>
            <FormLabel className="text-label">Program</FormLabel>
            <Input value={formData.program_code}  
                      className="text-box"
                      onChange={handleChange("program_code")}/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={3} rowStart={4} colSpan={2}>
          <FormControl>
            <FormLabel className="text-label">College</FormLabel>
            <Input value={formData.college_code}  
                      className="text-box"
                      onChange={handleChange("college_code")}/>
          </FormControl>
        </GridItem>    

        </Grid>

        <Box className="dialog-buttons">
          <Button type="submit" className="submit-button" onClick={handleConfirm}>
            Confirm Changes
          </Button>
          <Button type="reset" className="auth-button" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    )
    header = (
      <Box className="view-head-card">
          <h1>{student.id_number}</h1>
      </Box>
    )
  }
  else if ("program_code" in editData){
    const program = editData as Program
    content = (
      <p>Pogram Code: {program.program_code}</p>  
    )
  }

   else  if ("college_name" in editData){
      const college = editData as College
      content = (
        <p>College Code: {college.college_code}</p>  
      )
    }

  console.log("Function exited")

  return (
        <Box className="viewpopup-overlay">
            <Box className="viewpopup-content">
                {header}
                {content}
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

