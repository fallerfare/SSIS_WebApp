import { useState, type ChangeEvent, type FormEvent } from "react"
import { Box } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import useLogin from "../../hooks/useLogin";

export default function LogInForm() {
    
    const navigate = useNavigate()
    const login = useLogin();

    const [form, setForm] = useState({
        identity: "",
        user_password: "",
    })

    const [message, setMessage] = useState<string>("")

    // ============
    // Form event handlers (change in input, submit)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
          await login(
              form.identity,
              form.user_password
          );

          setMessage("Logged in!");
          setTimeout(() => navigate("/table/students"), 1000);

      } catch (err: any) {
          setMessage(err.response?.data?.message || "Login failed");
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
              name="identity"
              placeholder=" Username or Email"
              value={form.identity}
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

            <button type="submit" className="auth-button">Log In</button>

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