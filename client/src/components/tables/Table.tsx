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
import ViewModal from "../popups/view.tsx"

type TableProps = { 
    tableName: "students" | "programs" | "colleges"
}

const Table = ({ tableName }: TableProps) => {

    const [isViewOpen, setIsViewOpen] = useState(false)
    const [viewData, setViewData] = useState<any>(null)

    const handleView = (data: any) => {
        setViewData(data)
        setIsViewOpen(true)
    }

    const table = getTable(tableName, handleView)

    // function handleRowClick(rowData: any) {
        
    // }

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
                <select className="page-drop"
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
                </select>
        
        </Box>

        <ViewModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)}
        viewData={viewData}
        >
        </ViewModal>

    </Box>
    // ========== 
    // TABLE
   // ==========================
    
    )
}

export default Table