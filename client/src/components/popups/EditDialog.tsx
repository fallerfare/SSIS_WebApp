import { Box, Button, Grid, GridItem, Input } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import type { Student } from "@/models/types/students"
import type { Program } from "@/models/types/programs"
import type { College } from "@/models/types/colleges"
import { useState } from "react"
import { YearLevelDropdown, GenderDropdown, ProgramsDropdown, CollegesDropdown } from "../enrollment/FieldsConfig"

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
            <GenderDropdown
                selectedGender={formData.gender}
                setSelectedGender={(val) =>
                    setFormData({ ...formData, gender: val })
                    }
            />
          </FormControl>
        </GridItem>    

        <GridItem colStart={2} rowStart={3} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Year Level</FormLabel>
            <YearLevelDropdown
                selectedYear={formData.year_level}
                setSelectedYear={(val) =>
                    setFormData({ ...formData, year_level: val })
                    } 
            />
          </FormControl>
        </GridItem>    

        <GridItem colStart={1} rowStart={4} colSpan={2}>
          <FormControl>
            <FormLabel className="text-label">Program</FormLabel>
            <ProgramsDropdown
                  selectedCollege={formData.college_code}
                  selectedProgram={formData.program_code}
                  setSelectedProgram={(val) =>
                      setFormData({ ...formData, program_code: val })
                      }
              />
          </FormControl>
        </GridItem>    

        <GridItem colStart={3} rowStart={4} colSpan={2}>
          <FormControl>
            <FormLabel className="text-label">College</FormLabel>
            <CollegesDropdown 
                selectedCollege={formData.college_code}
                setSelectedCollege={(val) =>
                    setFormData({ ...formData, college_code: val })
                    }
            />
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

    const [formData, setFormData] = useState<Program>(editData)

    const handleChange = (field: keyof Program) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value})
    }

    const handleConfirm = () => {
      if (onConfirm) {
        onConfirm(formData as T)
      }
      onClose()
    }
    console.log("Program view chosen")
    content = (
      <Box>        
        <Grid
            templateColumns="repeat(1, 1fr)" 
            gap={6}>
          <GridItem colStart={1} rowStart={1} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Program Name</FormLabel>
            <Input value={formData.program_name} 
                      className="text-box"
                      onChange={handleChange("program_name")}/>
          </FormControl>
        </GridItem>

        <GridItem colStart={1} rowStart={2} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">College</FormLabel>
            <CollegesDropdown 
                selectedCollege={formData.college_code}
                setSelectedCollege={(val) =>
                    setFormData({ ...formData, college_code: val })
                    }
            />
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
          <h1>{program.program_code}</h1>
      </Box>
    )
  }

   else  if ("college_name" in editData){
    const college = editData as College

    const [formData, setFormData] = useState<College>(editData)

    const handleChange = (field: keyof College) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value})
    }

    const handleConfirm = () => {
      if (onConfirm) {
        onConfirm(formData as T)
      }
      onClose()
    }
    console.log("Program view chosen")
    content = (
      <Box>        
        <Grid
            templateColumns="repeat(1, 1fr)" 
            gap={6}>
          <GridItem colStart={1} rowStart={1} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">College Name</FormLabel>
            <Input value={formData.college_name} 
                      className="text-box"
                      onChange={handleChange("college_name")}/>
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
          <h1>{college.college_code}</h1>
      </Box>
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

