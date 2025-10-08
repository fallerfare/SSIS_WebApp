import { Box, Button, Grid, GridItem, Input } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import '../../style/App.css'
import { useState } from "react"
import type { College } from "@/models/types/colleges"
import { handleInsert } from "@/controller/api"

const EnrollmentForm = () => {
    
    const [formData, setFormData] = useState<College>({
        college_code: "",
        college_name: "",
    })

    const handleChange = (field: keyof College) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Clicked!")
        try {
            const response = await handleInsert<College>("colleges", formData)
            console.log("Inserted:", response)
            alert("Establishment successful!")
        } catch (err) {
            console.error(err)
            alert("Failed to establish college.")
        }
    }

    return (
    
    // ========================== 
    // FORM
    // ==========
    <Box>
        <Box className="add-logo" />
        <Box className="add-head-card">
            <h1>Establish College</h1>
        </Box>
        <Box className="add-card">
            <Grid
                templateColumns="repeat(1, 1fr)" 
                gap={6}>

            <GridItem colStart={1} rowStart={1} colSpan={1}>
            <FormControl>
                <FormLabel className="text-label">College Name</FormLabel>
                <Input   value={formData.college_code}
                            className="text-box"
                            onChange={handleChange("college_code")} />
            </FormControl>
            </GridItem>    

            <GridItem colStart={1} rowStart={2} colSpan={1}>
            <FormControl>
                <FormLabel className="text-label">College</FormLabel>
                <Input   value={formData.college_name}
                            className="text-box"
                            onChange={handleChange("college_name")} />
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