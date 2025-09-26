// import { StudentColumns } from "./StudentsTable"
// import { ProgramColumns } from "./ProgramsTable"
// import { CollegeColumns } from "./CollegesTable"
// import { ActionsColumns } from "./ActionsColumn"
// import type { ColumnDef } from "@tanstack/react-table"
// import type { Student } from "@/models/types/students"
// import type { Program } from "@/models/types/programs"
// import type { College } from "@/models/types/colleges"

// export const tableColumns = {
//   students: StudentColumns as ColumnDef<Student>[],
//   programs: ProgramColumns as ColumnDef<Program>[],
//   colleges: CollegeColumns as ColumnDef<College>[],
// }

// export function getColumns<T extends keyof typeof tableColumns> (
//     tableName: T
//     ): typeof tableColumns[T]{
//         return [...tableColumns[tableName], ActionsColumns]
//     } 
