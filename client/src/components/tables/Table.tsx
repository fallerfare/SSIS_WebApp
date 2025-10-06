import { Box, Button, Heading } from "@chakra-ui/react"
import { flexRender } from "@tanstack/react-table"
import '../../style/App.css'
import './TableConfig.tsx'
import { getTable } from "./TableConfig.tsx"
import Filters from "../Filters.tsx"
import prevten from "../../assets/icons/prevten.png"
import prev from "../../assets/icons/prev.png"
import nextten from "../../assets/icons/nextten.png"
import next from "../../assets/icons/next.png"
import { useState } from "react"
import ViewModal from "../popups/ViewDialog.tsx"
import DeleteModal from "../popups/DeleteDialog.tsx"
import EditModal from "../popups/EditDialog.tsx"

type TableProps = { 
    tableName: "students" | "programs" | "colleges"
}

const API_BASE = "http://localhost:8080"

const Table = ({ tableName }: TableProps) => {

    const [isViewOpen, setIsViewOpen] = useState(false)
    const [viewData, setViewData] = useState<any>(null)

    const handleView = (data: any) => {
        setViewData(data)
        setIsViewOpen(true)
    }

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)

    const handleEdit = (data: any) => {
        setEditData(data)
        setIsEditOpen(true)
    }

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deleteData, setDeleteData] = useState<any>(null)

    const handleDelete = (data: any) => {
        setDeleteData(data)
        setIsDeleteOpen(true)
    }

    const { table, reloadData } = getTable(tableName, handleView, handleEdit, handleDelete)

    const getId = (row: any) => {
    switch (tableName) {
      case "students": return row.id_number
      case "programs": return row.program_code
      case "colleges": return row.college_code
    }
  }

//   Move to api
  const handleConfirmEdit = async (updated: any) => {
    try {
      const id = getId(updated)

      const tokenRes = await fetch(`${API_BASE}/api/csrf-token`, {
      credentials: "include"
      })
      const { csrf_token } = await tokenRes.json()

      const res = await fetch(`${API_BASE}/edit/${tableName}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-CSRFToken": csrf_token },
        credentials: "include",
        body: JSON.stringify(updated),
      })

      if (!res.ok) throw new Error("Failed to update")

      const data = await res.json()
      console.log("Update success:", data)

      setIsEditOpen(false)
      reloadData()

    } catch (error) {
      console.error("Error saving edit:", error)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteData) return
    try {
      const id = getId(deleteData)

      const res = await fetch(`${API_BASE}/delete/${tableName}/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to delete")

      console.log("Delete success")
      setIsDeleteOpen(false)
      reloadData()

    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

    return (
    
    // ========================== 
    // TABLE
    // ==========
    <Box>
        <Box className="heading-card">
            <Heading as="h1">
                {tableName}
            </Heading>
            <Filters
                columnFilters={table.getState().columnFilters}
                setColumnFilters={table.setColumnFilters}
            />
        </Box>
        <Box className="table-card">
                    {/* ============ */}
                    {/* Headers */}
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Box className="tr-custom"
                                    key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Box className="th-custom"
                                            key={header.id}
                                            flex={(header.column.columnDef.meta as any)?.flex ?? 1}
                                            flexBasis={header.getSize()}>
                                        {
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }
                                        <Box className={`resizer ${
                                                                        header.column.getIsResizing()
                                                                         ? "isResizing"
                                                                         : ""}`}
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}/>
                                    </Box>
                                ))}
                            </Box>
                        ))}
                     {/* Headers */}
                    {/* ============ */}
        
                    {/* ============ */}
                    {/* Rows */}
                        {table.getRowModel().rows.map((row) => (
                                <Box className="tr-rows"
                                        key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <Box className="td-custom"
                                                key={(cell.id)}
                                                flex={(cell.column.columnDef.meta as any)?.flex ?? 1}
                                                flexBasis={cell.column.getSize()}>
                                            {
                                                flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )
                                            }
                                        </Box>
                                    ))}
                                </Box>
                            ))
                        }
                    {/* Rows */}
                    {/* ============ */}
        </Box>
        <Box className="pages-card">
                            
                <Button
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    >
                    <img src={prevten}/>
                </Button>

                <Button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    >
                    <img src={prev}/>
                </Button>

                <Button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    >
                    <img src={next}/>
                </Button>
                
                <Button
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    >
                    <img src={nextten}/>
                </Button>
                

                {/* TODO: Numbers must be dynamic, see ssis_sql */}
                {/* <select className="page-drop"
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                    >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                        {pageSize}
                        </option>
                    ))}
                </select> */}
        
        </Box>

        {/* ============ */}
        {/* Dialog Popups */}
        <ViewModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)}
        viewData={viewData}
        >
        </ViewModal>

         <EditModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)}
        editData={editData}
        onConfirm={handleConfirmEdit}
        >
        </EditModal>

         <DeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        deleteData={deleteData}
        onConfirm={handleConfirmDelete}
        >
        </DeleteModal>
        {/* Dialog Popups */}
        {/* ============ */}

    </Box>
    // ========== 
    // TABLE
   // ==========================
    
    )
}

export default Table