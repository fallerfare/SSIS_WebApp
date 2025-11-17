import { Box, Button, Grid, GridItem, Input } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import '../../style/App.css'
import { useState } from "react"
import type { College } from "@/models/types/colleges"
import { handleInsert } from "@/controller/api"
import ErrorPopup from "../popups/ErrorsDialog"
import SuccessPopup from "../popups/Success"

const EnrollmentForm = () => {

    const defaultFormData: College = {
        college_code: "",
        college_name: ""
    }
        
    
    const [formData, setFormData] = useState<College>(defaultFormData)

    const [isErrorOpen, setIsErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string>("")

    const handleChange = (field: keyof College) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await handleInsert<College>("colleges", formData)

            setSuccessMessage("Successfully established new college!")
            setIsSuccessOpen(true)
            setFormData(defaultFormData)
        } catch (err: any) {
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
            <h1>Establish College</h1>
        </Box>
        <form onSubmit={handleSubmit}>
            <Box className="add-card">
                <Grid
                    templateColumns="repeat(1, 1fr)"
                    gap={6}>
                <GridItem colStart={1} rowStart={1} colSpan={1}>
                <FormControl>
                    <FormLabel className="text-label">College Name</FormLabel>
                    <Input   value={formData.college_code}
                                className="text-box"
                                onChange={handleChange("college_code")}
                                required/>
                </FormControl>
                </GridItem>
                <GridItem colStart={1} rowStart={2} colSpan={1}>
                <FormControl>
                    <FormLabel className="text-label">College</FormLabel>
                    <Input   value={formData.college_name}
                                className="text-box"
                                onChange={handleChange("college_name")}
                                required/>
                </FormControl>
                </GridItem>
                </Grid>
                <Box className="dialog-buttons">
                <Button type="submit" className="submit-button" padding={"10px 60px"}>
                    Establish
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