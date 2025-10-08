import { Box, Button, Grid, GridItem, Input } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import '../../style/App.css'
import { useState } from "react"
import { CollegesDropdown } from "./FieldsConfig"
import type { Program } from "@/models/types/programs"
import { handleInsert } from "@/controller/api"

const EnrollmentForm = () => {
    
    const [formData, setFormData] = useState<Program>({
        program_code: "", 
        program_name: "",
        college_code: ""
    })

    const handleChange = (field: keyof Program) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Clicked!")
        try {
            const response = await handleInsert<Program>("programs", formData)
            console.log("Inserted:", response)
            alert("Establishment successful!")
        } catch (err) {
            console.error(err)
            alert("Failed to establish program.")
        }
    }

    return (
    
    // ========================== 
    // FORM
    // ==========
    <Box>
        <Box className="add-logo" />
        <Box className="add-head-card">
            <h1>Establish Program</h1>
        </Box>
        <Box className="add-card">
            <Grid
                templateColumns="repeat(1, 1fr)" 
                gap={6}>
    
            <GridItem colStart={1} rowStart={1} colSpan={1}>
            <FormControl>
                <FormLabel className="text-label">Program Code</FormLabel>
                <Input   value={formData.program_code}
                            className="text-box"
                            onChange={handleChange("program_code")} />
            </FormControl>
            </GridItem>    

            <GridItem colStart={1} rowStart={2} colSpan={1}>
            <FormControl>
                <FormLabel className="text-label">Program Name</FormLabel>
                <Input   value={formData.program_name}
                            className="text-box"
                            onChange={handleChange("program_name")} />
            </FormControl>
            </GridItem>    

            <GridItem colStart={1} rowStart={3} colSpan={1}>
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
            <Button type="submit" className="submit-button" padding={"10px 60px"} onClick={handleSubmit}>
                Establish
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