import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import type { UserData } from "../../models/types/UserData"
import { fetchCsrf, sendCsrf } from "../../controller/fetchCsrf"
import { Box } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function LogInForm() {
    
    const navigate = useNavigate()

    const [form, setForm] = useState<UserData>({
        user_name: "",
        user_password: "",
    })

    const [message, setMessage] = useState<string>("")
    const [csrf_token, setCsrfToken] =useState<string>("")

    // ============
    // Fetch CSRF Token
    useEffect(() => {
        fetchCsrf()
            .then((data) => setCsrfToken(data.csrf_token))
            .catch((err) => console.error("CSRF fetch error: ", err))
    })

    // ============
    // Form event handlers (change in input, submit)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const data = await sendCsrf(form, csrf_token, "login")
            if(data.success){
              setMessage(data.message || "Logged In successfully!")
              setTimeout(() => navigate("/table/students"), 1500) // TO DO: to home
            } else {
              setMessage(data.message || "Logged In failed!")
            }
        } catch (err: any){
            setMessage("Error: " + err.message)
        }
    }

    return (
      
      <Box>
        <Box className="auth-logo" />
        <Box className="auth-card">
          <Box className="auth-head-card">
            <h1>Welcome</h1>
          </Box>
          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="user_name"
              placeholder=" Username "
              value={form.user_name}
              onChange={handleChange}
              required
            />

            <br />

            <input
              type="password"
              name="user_password"
              placeholder=" Password "
              value={form.user_password}
              onChange={handleChange}
              required
            />

            <br />

            <button type="submit">Log In</button>

            <p>
                Don’t have an account?{" "}
                <Link to="/register" style={{ color: "blue", textDecoration: "underline" }}>
                  Create Account
                </Link>
            </p>


          </form>
          <p>{message}</p>
        </Box>
      </Box>
  )

}