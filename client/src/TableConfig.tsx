import { useState, useEffect } from "react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table"
import type { ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table"

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  let columns: ColumnDef<any>[] = []
  switch (tableName) {
    case "students":
      columns = StudentColumns
      break
    case "programs":
      columns = ProgramColumns
      break
    case "colleges":
      columns = CollegeColumns
      break
  }

  useEffect(() => {
    fetch(`http://localhost:8080/${tableName}/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error fetching data:", err))
  }, [tableName])

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    manualPagination: false, 
    manualSorting: false,
    manualFiltering: false,
  })

  return table
}