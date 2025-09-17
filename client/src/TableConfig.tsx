import { useState, useEffect } from "react"
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"

type TableName = "students" | "programs" | "colleges"

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

type Program = {

    program_code: string
    program_name: string
    college_code: string
}

type College = {

    college_code: string
    college_name: string
}

export const StudentColumns: ColumnDef<Student>[] = [
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

export const ProgramColumns: ColumnDef<Program>[] = [
    {
        header: "Program Code",
        accessorKey: "program_code",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 2},
    },
    {
        header: "Program Name",
        accessorKey: "program_name",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 3},
    },
    {
        header: "College Code",
        accessorKey: "college_code",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 2},
    },
]

export const CollegeColumns: ColumnDef<College>[] = [
    {
        header: "College Code",
        accessorKey: "college_code",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 2},
    },
    {
        header: "College Name",
        accessorKey: "college_name",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 3},
    },
]

export function getTable(tableName: TableName) {
    const [data, setData] = useState<any[]>([])
  
    let columns: ColumnDef<any>[] = [];
        switch (tableName) {
            case "students":
            columns = StudentColumns;
            break;
            case "programs":
            columns = ProgramColumns;
            break;
            case "colleges":
            columns = CollegeColumns;
            break;
        }

    useEffect(() => {
        fetch(`http://localhost:8080/${tableName}/list`, {
            method: "GET",
            credentials: "include"
        }) 
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error("Error fetching data:", err))
    }, [tableName])

    const table = useReactTable({
        data, 
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
    })

    return table
}