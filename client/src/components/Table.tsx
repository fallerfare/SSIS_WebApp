import { Box, Heading } from "@chakra-ui/react"
import { flexRender } from "@tanstack/react-table"
import '../style/App.css'
import '../TableConfig.tsx'
import { getTable } from "../TableConfig.tsx"
import Filters from "./Filters.tsx"

type TableProps = {
    tableName: "students" | "programs" | "colleges"
}

const Table = ({ tableName }: TableProps) => {
    const table = getTable(tableName)

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
            <Box className="table-scroll">
                <Box as="table"
                        className="table"
                        width="100%">
        
                    {/* ============ */}
                    {/* Headers */}
                    <Box as="thead">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Box className="tr"
                                    key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Box className="th"
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
                    </Box>
                     {/* Headers */}
                    {/* ============ */}
        
                    {/* ============ */}
                    {/* Rows */}
                    <Box as="tbody">
                        {table.getRowModel().rows.map((row) => (
                                <Box as="tr"
                                        className="tr-rows"
                                        key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <Box as="td"
                                                className="td"
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
                    </Box>
                    {/* Rows */}
                    {/* ============ */}
                </Box>
            </Box>
        </Box>
    </Box>
    // ========== 
    // TABLE
   // ==========================
    
    )
}

export default Table