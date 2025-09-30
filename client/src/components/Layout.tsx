import NavBar from './NavBar'
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import RegistrationForm from './authentication/RegistrationForm'
import { getSession } from '../controller/api'
import { useEffect, useState } from 'react'
import LogInForm from './authentication/LogInForm'
import TableLayout from './TableLayout'

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
            <Routes>
                <Route path="/" element={
                    isLoggedIn ? <Navigate to="/table/students" replace /> : <LogInForm />
                }/> 

                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<LogInForm />} />

                <Route path="/table/*" element={<TableLayout />} />
                
                <Route path="*" element = {<Navigate to="/login" replace />}/>
            </Routes>
        </>
    )
}

export default Layout

