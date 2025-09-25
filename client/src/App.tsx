import './style/App.css'
import NavBar from "./components/NavBar"
import Table from "./components/Table"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/students/list" element={<Table tableName="students" />} />
        <Route path="/programs/list" element={<Table tableName="programs" />} />
        <Route path="/colleges/list" element={<Table tableName="colleges" />} />
      </Routes>
    </Router>
  )
}

export default App

