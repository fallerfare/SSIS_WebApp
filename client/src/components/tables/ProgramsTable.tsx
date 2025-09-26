import type { Program } from "@/models/types/programs";
import type { ColumnDef } from "@tanstack/react-table";

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