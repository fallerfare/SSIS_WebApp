import { useState, useEffect } from "react"
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import { StudentColumns } from "./StudentsTable"
import { ProgramColumns } from "./ProgramsTable"
import { CollegeColumns } from "./CollegesTable"
import { getActionsColumns } from "./ActionsColumn"
import { fetchTableData } from "../../controller/api"

type TableName = "students" | "programs" | "colleges"

export function getTable(tableName: TableName,
                                      onView: (data:any) => void,
                                      onEdit: (data:any) => void,
                                      onDelete: (data:any) => void) {

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
      columns = [...StudentColumns, ...getActionsColumns("students", onView, onEdit, onDelete)]
      break
    case "programs":
      columns = [...ProgramColumns, ...getActionsColumns("programs", onView, onEdit, onDelete)]
      break
    case "colleges":
      columns = [...CollegeColumns, ...getActionsColumns("colleges", onView, onEdit, onDelete)]
      break
  }

  function reloadData(pageIndex = pagination.pageIndex, pageSize = pagination.pageSize) {
    fetchTableData(tableName, pageIndex, pageSize)
      .then((result) => {
        setData(result.data)
        console.log("API result after reload:", result)
        setPageCount(Math.ceil(result.total / pagination.pageSize))
      })
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    reloadData()
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

  return { table, reloadData }
}