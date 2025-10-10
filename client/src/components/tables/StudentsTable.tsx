import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/models/types/students";


export const StudentColumns: ColumnDef<Student>[] = [
    {
        id: "id_number",
        header: "Student ID",
        accessorKey: "id_number",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 1},
    },
    {
        id: "name",
        header: "Name",
        accessorFn: (row) => 
            `${row.first_name} ${row.middle_name} ${row.last_name}`,
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 3},
    },
    {
        id: "year_level",
        header: "Year Level",
        accessorFn: (row) =>
            `Year ${row.year_level}`,
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 1},
    },
    {
        id: "program_code",
        header: "Program Code",
        accessorKey: "program_code",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 2},
    },
    {
        id: "college_code",
        header: "College Code",
        accessorKey: "college_code",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 2},
    },
]