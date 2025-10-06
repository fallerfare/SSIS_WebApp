import { Box, Button, Grid, GridItem, Input } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import '../../style/App.css'
import { useEffect, useState } from "react"
import { getCollegeList, getProgramList } from "@/controller/api"
import type { College } from "@/models/types/colleges"
import type { Program } from "@/models/types/programs"

const EnrollmentForm = () => {

    function getGenders() {
        return ["Male", "Female", "Others"]
    }
    const [selectedGender, setSelectedGender] = useState("")
    const genders = getGenders()

    function getYearLevel() {
        return [1, 2, 3, 4, 5]
    }
    const [selectedYear, setSelectedYear] = useState("")
    const years = getYearLevel()

    const [selectedCollege, setSelectedCollege] = useState("")
    const [listColleges, setColleges] = useState<College[]>([])

    useEffect(() => {
        const fetchColleges = async () => {
            try {
            const response: any = await getCollegeList()
            console.log("Colleges response:", response)
            setColleges(response.data)
            } catch (err) {
            console.error("Failed to fetch colleges:", err)
            }
        }
        fetchColleges()
    }, [])

    const [selectedProgram, setSelectedProgram] = useState("")
    const [listPrograms, setPrograms] = useState<Program[]>([])

    useEffect(() => {
        if (!selectedCollege) return
        const fetchPrograms = async () => {
            try {
            const response: any = await getProgramList(selectedCollege)
            console.log("Colleges response:", response)
            setPrograms(response.data)
            } catch (err) {
            console.error("Failed to fetch colleges:", err)
            }
        }
        fetchPrograms()
    }, [selectedCollege])

    return (
    
    // ========================== 
    // FORM
    // ==========
    <Box>
        <Box className="add-logo" />
        <Box className="add-head-card">
            <h1>Enrollment</h1>
        </Box>
        <Box className="add-card">
            <Grid
                templateColumns="repeat(4, 1fr)" 
                gap={6}>
            <GridItem colStart={1} rowStart={1} colSpan={2}>
            <FormControl>
                <FormLabel className="text-label">First Name</FormLabel>
                <Input className="text-box"/>
            </FormControl>
            </GridItem>

            <GridItem colStart={3} rowStart={1} colSpan={1}>
            <FormControl>
                <FormLabel className="text-label">Middle Name</FormLabel>
                <Input className="text-box" />
            </FormControl>
            </GridItem>

            <GridItem colStart={4} rowStart={1} colSpan={1}>
            <FormControl>
                <FormLabel className="text-label">Last Name</FormLabel>
                <Input className="text-box" />
            </FormControl>
            </GridItem>

            <GridItem colStart={1} rowStart={2} colSpan={4}>
            <FormControl>
                <FormLabel className="text-label">Email</FormLabel>
                <Input className="text-box" />
            </FormControl>
            </GridItem>    

            <GridItem colStart={1} rowStart={3} colSpan={1}>
            <FormControl>
                <FormLabel className="text-label">Gender</FormLabel>
                <select   id="gender"
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                            className="options">
                                <option value="" disabled hidden>
                                    Select Gender
                                </option>
                                {genders.map((gender) => (  
                                <option key={gender} value={gender}>
                                    {gender}
                                </option>
                                ))}
                </select>
            </FormControl>
            </GridItem>    

            <GridItem colStart={2} rowStart={3} colSpan={1}>
            <FormControl>
                <FormLabel className="text-label">Year Level</FormLabel>
                <select   id="year"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="options">
                                <option value="" disabled hidden>
                                    Select Year Level
                                </option>
                                {years.map((ylevel) => (  
                                <option key={ylevel} value={ylevel}>
                                    {ylevel}
                                </option>
                                ))}
                </select>
            </FormControl>
            </GridItem>    

            <GridItem colStart={1} rowStart={4} colSpan={2}>
            <FormControl>
                <FormLabel className="text-label">Program</FormLabel>
                <select   id="program"
                            value={selectedProgram}
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            className="options">
                                <option value="" disabled hidden>
                                    Select Program
                                </option>
                                {listPrograms.map((program) => (  
                                <option key={program.program_code} value={program.program_code}>
                                    {program.program_name}
                                </option>
                                ))}
                </select>
            </FormControl>
            </GridItem>    

            <GridItem colStart={3} rowStart={4} colSpan={2}>
            <FormControl>
                <FormLabel className="text-label">College</FormLabel>
                <select   id="college"
                            value={selectedCollege}
                            onChange={(e) => setSelectedCollege(e.target.value)}
                            className="options">
                                <option value="" disabled hidden>
                                    Select College
                                </option>
                                {listColleges.map((college) => (  
                                <option key={college.college_code} value={college.college_code}>
                                    {college.college_name}
                                </option>
                                ))}
                </select>
            </FormControl>
            </GridItem>    

            </Grid>

            <Box className="dialog-buttons">
            <Button type="submit" className="submit-button" padding={"10px 60px"}>
                Enroll
            </Button>
            </Box>
        </Box>
    </Box>
    // ========== 
    // FORM
   // ==========================
    
    )
}

export default EnrollmentForm