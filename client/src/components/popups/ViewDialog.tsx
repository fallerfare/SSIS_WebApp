import { Box, Grid, GridItem, Input } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import type { Student } from "@/models/types/students"
import type { Program } from "@/models/types/programs"
import type { College } from "@/models/types/colleges"
import { getCollegeName, getProgramName } from "@/controller/api"
import { useEffect, useState } from "react"

type ViewModalProps<T> = {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode 
  viewData?: T
}

export default function ViewModal<T extends Student | Program | College>(
                                                { isOpen, onClose, viewData }:
                                                ViewModalProps<T> ) {

  if (!isOpen || !viewData) return null

  let content: React.ReactNode = null
  let header: React.ReactNode = null

  if ("id_number" in viewData){
    const student = viewData as Student

    const [programName, setProgramName] = useState("")
    const [collegeName, setCollegeName] = useState("")

    useEffect(() => {
      getProgramName(student.program_code)
        .then(({ program_name }) => setProgramName(program_name ?? ""))
      getCollegeName(student.college_code)
        .then(({ college_name }) => setCollegeName(college_name ?? ""))
    }, [])

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

        <GridItem colStart={1} rowStart={4} colSpan={4}>
          <FormControl>
            <FormLabel className="text-label">Program</FormLabel>
            <Input value={programName} readOnly  className="text-box"/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={1} rowStart={5} colSpan={4}>
          <FormControl>
            <FormLabel className="text-label">College</FormLabel>
            <Input value={collegeName} readOnly  className="text-box"/>
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

    const [collegeName, setCollegeName] = useState("")

    useEffect(() => {
      getCollegeName(program.college_code)
        .then(({ college_name }) => setCollegeName(college_name ?? ""))
    }, [])

    content = (
      <Box>        
        <Grid
            templateColumns="repeat(1, 1fr)" 
            gap={6}>

        <GridItem colStart={1} rowStart={1} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">Program Name</FormLabel>
            <Input value={program.program_name} readOnly  className="text-box"/>
          </FormControl>
        </GridItem>    

        <GridItem colStart={1} rowStart={2} colSpan={1}>
          <FormControl>
            <FormLabel className="text-label">College</FormLabel>
            <Input value={collegeName} readOnly  className="text-box"/>
          </FormControl>
        </GridItem>    

        </Grid>
      </Box>
    )
    header = (
      <Box className="view-head-card">
          <h1>{program.program_code}</h1>
      </Box>
    )
  }

   else  if ("college_name" in viewData){
    const college = viewData as College
    content = (
      <Box>        
        <Grid
            templateColumns="repeat(1, 1fr)" 
            gap={6}>

        <GridItem colStart={1} rowStart={1} colSpan={2}>
          <FormControl>
            <FormLabel className="text-label">College Name</FormLabel>
            <Input value={college.college_name} readOnly  className="text-box"/>
          </FormControl>
        </GridItem>    

        </Grid>
      </Box>
    )
    header = (
      <Box className="view-head-card">
          <h1>{college.college_code}</h1>
      </Box>
    )
    }


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

