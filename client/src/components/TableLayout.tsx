import Table from "./tables/Table"
import { Routes, Route } from "react-router-dom"

function TableLayout() {

    return (
        <>
            <Routes>
                <Route path="/students" element={<Table tableName="students" />} />
                <Route path="/programs" element={<Table tableName="programs" />} />
                <Route path="/colleges" element={<Table tableName="colleges" />} />
            </Routes>
        </>
    )
}

export default TableLayout

