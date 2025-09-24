import { useState, useEffect } from "react"
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import EditIcon from "./assets/icons/edit-idle.png"
// import EditIconHover from "./assets/icons/edit-hover.png"
import DeleteIcon from "./assets/icons/trash-bin_close.png"
// import DeleteIconHover from "./assets/icons/trash-bin_open.png"


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
        meta: { flex: 2 }
    },
]

// export function getTable(tableName: TableName) {
//   const [data, setData] = useState<any[]>([])

//   const [pageCount, setPageCount] = useState(0)
  
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//   })

//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const [sorting, setSorting] = useState<SortingState>([])

//   let columns: ColumnDef<any>[] = []
//   switch (tableName) {
//     case "students":
//       columns = StudentColumns
//       break
//     case "programs":
//       columns = ProgramColumns
//       break
//     case "colleges":
//       columns = CollegeColumns
//       break
//   }

//   useEffect(() => {
//     const { pageIndex, pageSize } = pagination

//     const query = new URLSearchParams({
//       page: pageIndex.toString(),
//       size: pageSize.toString(),
//       sort: sorting[0]?.id ?? "",
//       order: sorting[0]?.desc ? "desc" : "asc",
//       filters: JSON.stringify(columnFilters),
//     })



//     fetch(`http://localhost:8080/${tableName}/list?${query}`, {
//       method: "GET",
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((json) => {
//         setData(json.rows ?? json)
//         setPageCount(json.pageCount ?? 0)
//       })
//       .catch((err) => console.error("Error fetching data:", err))
//   }, [tableName, pagination, sorting, columnFilters])

//   const table = useReactTable({
//     data,
//     columns,
//     pageCount,
//     state: {
//       columnFilters,
//       pagination,
//       sorting,
//     },
    
//     columnResizeMode: "onChange",
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),

//     onPaginationChange: setPagination,
//     manualPagination: true, 

//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
    
//     manualSorting: false,
//     manualFiltering: false,
//   })

//   return table
// }

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