import { useState, useEffect } from "react"
import { Box } from "@chakra-ui/react"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import '../style/App.css'

// TO DO: Dynamicify
type Student = {

    id_number: string
    first_name: string
    middle_name: string
    last_name: string
    gender: string
    email: string
    year_level: number
    program_code: string
    college_code: string
}

const columns: ColumnDef<Student>[] = [
    {
        header: "Student ID",
        accessorKey: "id_number",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 1},
    },
    {
        header: "Name",
        accessorFn: (row) => 
            `${row.first_name} ${row.middle_name} ${row.last_name}`,
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 3},
    },
    {
        header: "Year Level",
        accessorFn: (row) =>
            `Year ${row.year_level}`,
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 1},
    },
    {
        header: "Program Code",
        accessorKey: "program_code",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 2},
    },
    {
        header: "College Code",
        accessorKey: "college_code",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 2},
    },
]

const Table = () => {
    // TO DO: Dynamicify
    const [data, setData] = useState<Student[]>([])

    useEffect(() => {
        fetch("http://localhost:8080/students/list", {
            method: "GET",
            credentials: "include"
        }) 
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error("Error fetching data:", err))
    }, [])

    const table = useReactTable({
        data, 
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
    })

    console.log(table.getHeaderGroups())
    return (
    
    // ========================== 
    // TABLE
    // ==========
    <Box className="table-card">
        <Box as="table"
                className="table"
                width="100%">
            
            {/* ============ */}
            {/* Headers */}
            {table.getHeaderGroups().map((headerGroup) => (
                
                <Box className="tr" 
                        id = "header"
                        key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        
                        <Box className="th" 
                                key={header.id} 
                                flex={(header.column.columnDef.meta as any)?.flex ?? 1}
>
                            {
                                flexRender(
                                    header.column.columnDef.header, 
                                    header.getContext()
                                )
                            }

                        </Box>
                    ))}
            {/* Headers */}
            {/* ============ */}

                </Box>
            ))}
            
            {/* ============ */}
            {/* Rows */}
            {
                table.getRowModel().rows.map((row) => (
                    <Box className="tr" 
                            key={row.id}>

                        {row.getVisibleCells().map((cell) => (
                            <Box className="td" 
                                    key={(cell.id)} 
                                    flex={(cell.column.columnDef.meta as any)?.flex ?? 1}
>

                                {
                                    flexRender(
                                        cell.column.columnDef.cell, 
                                        cell.getContext()
                                    )
                                }

                            </Box>
                        ))}
                    </Box>
                ))
            }
            {/* Rows */}
            {/* ============ */}

        </Box>
    </Box>
    // ========== 
    // TABLE
   // ==========================
    )
}

export default Table