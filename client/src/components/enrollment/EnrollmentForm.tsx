import { Box, Button, Grid, GridItem, Input } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import '../../style/App.css'
import { useState } from "react"
import { GenderDropdown, YearLevelDropdown, ProgramsDropdown, CollegesDropdown } from "../FieldsConfig"
import type { Student } from "@/models/types/students"
import { handleInsert } from "@/controller/api"
import SuccessPopup from "../popups/Success"
import ErrorPopup from "../popups/ErrorsDialog"

const EnrollmentForm = () => {

    const defaultFormData: Student = {
    id_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    gender: "",
    year_level: 1,
    college_code: "",
    program_code: "",
    }

    const [formData, setFormData] = useState<Student>(defaultFormData)

    
    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [isErrorOpen, setIsErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleChange = (field: keyof Student) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await handleInsert<Student>("students", formData)

            setSuccessMessage("Successfully enrolled new student!")
            setIsSuccessOpen(true)
            console.log("Inserted:", response)
            setFormData(defaultFormData)
        } catch (err: any) {
            console.error(err)
            setErrorMessage(err.message)
            setIsErrorOpen(true)
        } 
    }

    return (
    
    // ========================== 
    // FORM
    // ==========
    <Box>
        <Box className="add-logo" />
        <Box className="add-head-card">
            <h1>Enrollment</h1>
        </Box>
        <form onSubmit={handleSubmit}>
            <Box className="add-card">
                <Grid
                    templateColumns="repeat(4, 1fr)"
                    gap={6}>
                <GridItem colStart={1} rowStart={1} colSpan={2}>
                <FormControl isRequired>
                    <FormLabel className="text-label">First Name</FormLabel>
                    <Input   value={formData.first_name}
                                className="text-box"
                                onChange={handleChange("first_name")}
                                required/>
                </FormControl>
                </GridItem>
                <GridItem colStart={3} rowStart={1} colSpan={1}>
                <FormControl>
                    <FormLabel className="text-label">Middle Name</FormLabel>
                    <Input   value={formData.middle_name}
                                className="text-box"
                                onChange={handleChange("middle_name")}
                                required/>
                </FormControl>
                </GridItem>
                <GridItem colStart={4} rowStart={1} colSpan={1}>
                <FormControl>
                    <FormLabel className="text-label">Last Name</FormLabel>
                    <Input value={formData.last_name}
                                className="text-box"
                                onChange={handleChange("last_name")}
                                required/>
                </FormControl>
                </GridItem>
                <GridItem colStart={1} rowStart={2} colSpan={4}>
                <FormControl>
                    <FormLabel className="text-label">Email</FormLabel>
                    <Input value={formData.email}
                                className="text-box"
                                onChange={handleChange("email")}
                                required/>
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
                <GridItem colStart={3} rowStart={3} colSpan={2}>
                <FormControl>
                    <FormLabel className="text-label">Student ID</FormLabel>
                    <Input   value={formData.id_number}
                                className="text-box"
                                onChange={handleChange("id_number")} 
                                required/>
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
                <Button type="submit" className="submit-button" padding={"10px 60px"}>
                    Enroll
                </Button>
                </Box>
            </Box>
        </form>

        <ErrorPopup
            isOpen={isErrorOpen}
            message={errorMessage}
            onClose={() => setIsErrorOpen(false)}
        />

        <SuccessPopup
            isOpen={isSuccessOpen} 
            message={successMessage}
            onClose={() => setIsSuccessOpen(false)}
        />
    </Box>
    // ========== 
    // FORM
   // ==========================
    
    )
}

export default EnrollmentForm