import NavBar from './NavBar'
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom"
import RegistrationForm from './authentication/RegistrationForm'
import { fetchMe } from '../controller/api'
import { useEffect, useState } from 'react'
import LogInForm from './authentication/LogInForm'
import TableLayout from './TableLayout'
import EnrollmentForm from './enrollment/EnrollmentForm'
import EstablishProgram from './establish/EstablishProgram'
import EstablishCollege from './establish/EstablishCollege'
import ViewUserDetails from './ViewUserDetails'
import { PublicRoute } from './authentication/PublicRoute'
import { ProtectedRoute } from './authentication/ProtectedRoute'

function Layout() {

    const locator = useLocation()
    const navigate = useNavigate()

    const hideNavBar = 
            locator.pathname === "/"            ||
            locator.pathname === "/login"      ||
            locator.pathname === "/register"

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        const checkSession = async () => {
            const data = await fetchMe();
            console.log("isLoggedIn data: ", data)
            console.log("isLoggedIn value: ", data.isLoggedIn)
            setIsLoggedIn(data.isLoggedIn);
        };
        checkSession();
    }, []);

    console.log(isLoggedIn)


    return (
        <>
            {!hideNavBar && <NavBar />}    
            <div>
                <Routes>
        
                    {/* =========== */}
                    {/* PUBLIC */}
                    <Route path="/register" element={
                        <PublicRoute isLoggedIn={isLoggedIn}>
                            <RegistrationForm />
                        </PublicRoute>
                    } />

                    <Route path="/login" element={
                        <PublicRoute isLoggedIn={isLoggedIn}>
                            <LogInForm onLogIn={() => setIsLoggedIn(true)}/>
                        </PublicRoute>
                    } />
                    {/* PUBLIC */}
                    {/* =========== */}

                    {/* =========== */}
                    {/* PRIVATE */}
                    <Route path="/table/*" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <TableLayout />
                        </ProtectedRoute>
                    } />

                    <Route path="/enrollment" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <EnrollmentForm />
                        </ProtectedRoute>
                    } />

                    <Route path="/establish/programs" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <EstablishProgram />
                        </ProtectedRoute>
                    } />

                    <Route path="/establish/colleges" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <EstablishCollege />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <ViewUserDetails onLogout={handleLogout}/>
                        </ProtectedRoute>
                    } />
                    {/* PRIVATE */}
                    {/* =========== */}
                    
                    {/* =========== */}
                    {/* MISC */}
                    <Route
                        path="*"
                        element={
                            isLoggedIn
                            ? <Navigate to="/table/students" replace />
                            : <Navigate to="/login" replace />
                        }   
                    />
                    {/* MISC */}
                    {/* =========== */}

                </Routes>
            </div>
        </>
    )
}

export default Layout

