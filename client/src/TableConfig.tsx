import { useState, useEffect } from "react"
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import EditIcon from "./assets/icons/edit-idle.png"
import DeleteIcon from "./assets/icons/trash-bin_close.png"
import ViewIcon from "./assets/icons/view-idle.png"
import './style/App.css'

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

export const ActionsColumns: ColumnDef<any>[] = [
  {
        header: "Actions",
        accessorKey: "actions",
        cell: ({row}) => {
            const original = row.original

            return (
              <div>
                <img
                  src={ViewIcon}
                  alt="View"
                  className="view-button"
                  onClick={() => console.log("View clicked!", original)}
                />
                <img
                  src={EditIcon}
                  alt="Edit"
                  className="edit-button"
                  onClick={() => console.log("Edit clicked!", original)}
                />
                <img
                  src={DeleteIcon}
                  alt="Delete"
                  className="delete-button"
                  onClick={() => console.log("Delete clicked!", original)}
                />
              </div>
            )
        },
        meta: { flex: 1 }
    },
]

export function getTable(tableName: TableName) {
  const [data, setData] = useState<any[]>([])
  const [pageCount, setPageCount] = useState(-1)
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  let columns: ColumnDef<any>[] = []
  switch (tableName) {
    case "students":
      columns = [...StudentColumns, ...ActionsColumns]
      break
    case "programs":
      columns = [...ProgramColumns, ...ActionsColumns]
      break
    case "colleges":
      columns = [...CollegeColumns, ...ActionsColumns]
      break
  }

  useEffect(() => {
    const fetchData = async () => {

      const params = new URLSearchParams({
        page: pagination.pageIndex.toString(),
        limit: pagination.pageSize.toString(),
      })

  try {
        const response = await fetch(`http://localhost:8080/${tableName}/list?${params}`)
        const result = await response.json()
        
        setData(result.data)
        setPageCount(Math.ceil(result.total / pagination.pageSize))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [tableName, pagination.pageIndex, pagination.pageSize])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, 
  })

  return table
}