import NavBar from './NavBar'
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import RegistrationForm from './authentication/RegistrationForm'
import { getSession } from '../controller/api'
import { useEffect, useState } from 'react'
import LogInForm from './authentication/LogInForm'
import TableLayout from './TableLayout'
import EnrollmentForm from './enrollment/EnrollmentForm'
import EstablishProgram from './establish/EstablishProgram'
import EstablishCollege from './establish/EstablishCollege'
import ViewUserDetails from './ViewUserDetails'

function Layout() {

    const locator = useLocation()

    const hideNavBar = 
            locator.pathname === "/"            ||
            locator.pathname === "/login"      ||
            locator.pathname === "/register"

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        getSession()
        .then((data) => setIsLoggedIn(data.isLoggedIn))
        .catch(() => setIsLoggedIn(false))
    }, [])

    return (
        <>
            {!hideNavBar && <NavBar />}    
            <div>
                <Routes>
        
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route path="/login" element={<LogInForm />} />
                    <Route path="/table/*" element={<TableLayout />} />
                    <Route path="/enrollment" element={<EnrollmentForm />} />
                    <Route path="/establish/programs" element={<EstablishProgram />} />
                    <Route path="/establish/colleges" element={<EstablishCollege />} />
                    <Route path="/profile" element={<ViewUserDetails />} />
                    <Route
                        path="*"
                        element={
                            isLoggedIn
                            ? <Navigate to="/table/students" replace />
                            : <Navigate to="/login" replace />
                        }   
                    />
                </Routes>
            </div>
        </>
    )
}

export default Layout

