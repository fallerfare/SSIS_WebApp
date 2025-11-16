import { useState, type ChangeEvent, type FormEvent } from "react"
import type { UserData } from "../../models/types/UserData"
import { Box } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import useRegister from "../../hooks/useRegister"

export default function RegistrationForm() {

    const navigate = useNavigate()
    const [form, setForm] = useState<UserData>({
        user_name: "",
        user_email: "",
        user_password: "",
    })
    const register = useRegister();

    const [message, setMessage] = useState<string>("")

    // ============
    // Form event handlers (change in input, submit)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      const response = await register(form);

      if (response.success) {
          setMessage("Registered!");
          setTimeout(() => navigate("/login"), 1500);
      }
  };


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

            <button type="submit" className="auth-button">Register</button>

            <p>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "blue", textDecoration: "underline" }}>
                  Log In
                </Link>
            </p>

          </form>
          <p>{message}</p>
        </Box>
      </Box>
  )

}