import { Box, Heading } from "@chakra-ui/react"
import { flexRender } from "@tanstack/react-table"
import '../../style/App.css'
import './TableConfig.tsx'
import { getTable } from "./TableConfig.tsx"
import Filters from "../Filters.tsx"
import { useEffect, useState } from "react"
import ViewModal from "../popups/ViewDialog.tsx"
import DeleteModal from "../popups/DeleteDialog.tsx"
import EditModal from "../popups/EditDialog.tsx"
import { handleUpdate, handleDelete } from "@/controller/api.ts"
import upIcon from "../../assets/icons/asc_icon.png"
import downIcon from "../../assets/icons/desc_icon.png"
import ErrorPopup from "../popups/ErrorsDialog.tsx"
import SuccessPopup from "../popups/Success.tsx"
import PaginationButtons from "./Pagination.tsx"


type TableProps = { 
    tableName: "students" | "programs" | "colleges"
}

const Table = ({ tableName }: TableProps) => {

    const [isViewOpen, setIsViewOpen] = useState(false)
    const [viewData, setViewData] = useState<any>(null)

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deleteData, setDeleteData] = useState<any>(null)

    const [selectedTag, setSelectedTag] = useState<string>("")
    const [searchKey, setSearchKey] = useState<string>("")

    const [isErrorOpen, setIsErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string>("")

    const handleTableView = (data: any) => {
        setViewData(data)
        setIsViewOpen(true)
    }

    const handleTableEdit = (data: any) => {
        setEditData(data)
        setIsEditOpen(true)
    }

    const handleTableDelete = (data: any) => {
        setDeleteData(data)
        setIsDeleteOpen(true)
    }
 
    const { table, reloadData } = getTable(tableName, handleTableView, handleTableEdit, handleTableDelete, selectedTag, searchKey)

    const getId = (row: any) => {
    switch (tableName) {
      case "students": return row.id_number
      case "programs": return row.program_code
      case "colleges": return row.college_code
    }
  }

   const handleConfirmEdit = async (updated: any) => {
    const id = getId(updated)
    try {
        const response = await handleUpdate(tableName, updated, id)
        setSuccessMessage(`Succesfully edited ${tableName}`)
        setIsSuccessOpen(true)
        reloadData()
        console.log("Update:", response)
        setIsEditOpen(false)

    } catch (err: any) {
            console.log(err)
            setErrorMessage(err.message)
            setIsErrorOpen(true)
    } 
  }

  const handleConfirmDelete = async () => {
        const id = getId(deleteData)
        try {
            const response = await handleDelete(tableName, id)

            if (!response.success) {
                if (response.error === "ForeignKeyViolation") {
                    console.log(response.error)
                    setErrorMessage(response.message || "Delete restricted.")
                    setIsErrorOpen(true)
                } else {
                    setErrorMessage(response.message || "An unexpected error occurred.")
                    setIsErrorOpen(true)
                }
            } else {
            setSuccessMessage(`Succesfully deleted ${tableName}`)
            setIsSuccessOpen(true)
            reloadData()
            }
        } catch (err) {
            console.log(err)
            setErrorMessage("Server connection error. Please try again.")
            setIsErrorOpen(true)
        } finally {
            setIsDeleteOpen(false)
        }
    }

  const handleFilters = async () => {
    table.setPageIndex(0)
    reloadData({ search_tag: selectedTag, search_key: searchKey })
    console.log("tag: ", selectedTag, "key: ", searchKey)
  }

  useEffect(() => {
      setSelectedTag("")
      setSearchKey("")
  
      table.setPageIndex(0)
      table.resetSorting()
  
      reloadData({
        pageIndex: 0,
        pageSize: 10,
        search_tag: "",
        search_key: "",
        sort: "",
        order: "asc"
      })
    }, [tableName])

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
                tableName={tableName}
                onSearch={handleFilters}
                selectedKey={searchKey}
                setSelectedKey={setSearchKey}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
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
                                            flexBasis={header.getSize()}
                                            onClick={header.column.getToggleSortingHandler()}
                                            cursor="pointer">
                                        {
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }

                                        {header.column.getIsSorted() === "asc" && (
                                            <img src={upIcon} alt="Ascending" className="sort-icons" />
                                        )}

                                        {header.column.getIsSorted() === "desc" && (
                                            <img src={downIcon} alt="Descending" className="sort-icons" />
                                        )}

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
        <PaginationButtons table={table}/>

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
        <ErrorPopup
        isOpen={isErrorOpen}
        message={errorMessage}
        onClose={() => setIsErrorOpen(false)}
        />

        <SuccessPopup
            isOpen={isSuccessOpen} 
            message={successMessage}
            onClose={() => setIsSuccessOpen(false)}
        />
        {/* Dialog Popups */}
        {/* ============ */}

    </Box>
    // ========== 
    // TABLE
   // ==========================
    
    )
}

export default Table