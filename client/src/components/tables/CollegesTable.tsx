import type { College } from "@/models/types/colleges";
import type { ColumnDef } from "@tanstack/react-table";

export const CollegeColumns: ColumnDef<College>[] = [
    {
        id: "college_code",
        header: "College Code",
        accessorKey: "college_code",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 2},
    },
    {
        id: "college_name",
        header: "College Name",
        accessorKey: "college_name",
        cell: (info) => <p>{info.getValue<string>()}</p>,
        meta: { flex: 3},
    },
]