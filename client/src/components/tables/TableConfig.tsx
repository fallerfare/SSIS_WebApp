import { useState, useEffect } from "react"
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import { StudentColumns } from "./StudentsTable"
import { ProgramColumns } from "./ProgramsTable"
import { CollegeColumns } from "./CollegesTable"
import { ActionsColumns } from "./ActionsColumn"
import { fetchTableData } from "@/controller/api"

type TableName = "students" | "programs" | "colleges"

export function getTable(tableName: TableName) {
  const [data, setData] = useState<any[]>([])

  // ===============
  // Pagination
  const [pageCount, setPageCount] = useState(-1)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 10 })
    }, [tableName])

  // ===============
  // Filtering
  // const [tag, setTag] = useState(-1)
  // const [key, setKey] = useState(-1)

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
    fetchTableData(tableName, pagination.pageIndex, pagination.pageSize)
      .then((result) => {
        setData(result.data)
        setPageCount(Math.ceil(result.total / pagination.pageSize))
      })
      .catch((err) => console.error(err))
  }, [tableName, pagination.pageIndex, pagination.pageSize])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
    },

    // ===============
    // Pagination
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    manualPagination: true, 

    // ===============
    // Filtering
    manualFiltering: true
  })

  return table
}