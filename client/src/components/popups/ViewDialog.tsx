import { Box, Grid, GridItem, Input } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import type { Student } from "@/models/types/students"
import type { Program } from "@/models/types/programs"
import type { College } from "@/models/types/colleges"

type ViewModalProps<T> = {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode 
  viewData?: T
}

export default function ViewModal<T extends Student | Program | College>(
                                                { isOpen, onClose, viewData }:
                                                ViewModalProps<T> ) {
  console.log(viewData)

  if (!isOpen || !viewData) return null

  let content: React.ReactNode = null
  let header: React.ReactNode = null

  if ("id_number" in viewData){
    const student = viewData as Student
    console.log("Student view chosen")
    content = (
      <Box>        
        <Grid
            templateColumns="repeat(4, 1fr)" 
            gap={6}>
          <GridItem colStart={1} rowStart={1} colSpan={2}>
          <FormControl>
            <FormLabel className="text-label">First Name</FormLabel>
            <Input value={student.first_name} readOnly className="text-box"/>
          </FormControl>
        </GridItem>

        <GridItem colStart={3} rowStart={1} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Middle Name</FormLabel>
            <Input value={student.middle_name} readOnly className="text-box" />
          </FormControl>
        </GridItem>

        <GridItem colStart={4} rowStart={1} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Last Name</FormLabel>
            <Input value={student.last_name} readOnly className="text-box"/>
          </FormControl>
        </GridItem>

        <GridItem colStart={1} rowStart={2} colSpan={4}>
          <FormControl>
            <FormLabel className="text-label">Email</FormLabel>
            <Input value={student.email} readOnly className="text-box"/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={1} rowStart={3} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Gender</FormLabel>
            <Input value={student.gender} readOnly className="text-box"/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={2} rowStart={3} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Year Level</FormLabel>
            <Input value={student.year_level} readOnly className="text-box"/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={1} rowStart={4} colSpan={2}>
          <FormControl>
            <FormLabel className="text-label">Program</FormLabel>
            <Input value={student.program_code} readOnly  className="text-box"/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={3} rowStart={4} colSpan={2}>
          <FormControl>
            <FormLabel className="text-label">College</FormLabel>
            <Input value={student.college_code} readOnly  className="text-box"/>
          </FormControl>
        </GridItem>    

        </Grid>
      </Box>
    )
    header = (
      <Box className="view-head-card">
          <h1>{student.id_number}</h1>
      </Box>
    )
  }
  else if ("program_code" in viewData){
    const program = viewData as Program
    content = (
      <p>Pogram Code: {program.program_code}</p>  
    )
  }

   else  if ("college_name" in viewData){
      const college = viewData as College
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

