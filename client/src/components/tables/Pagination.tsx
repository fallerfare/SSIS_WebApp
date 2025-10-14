import { Box, Button } from "@chakra-ui/react"
import prevten from "../../assets/icons/prevten.png"
import prev from "../../assets/icons/prev.png"
import nextten from "../../assets/icons/nextten.png"
import next from "../../assets/icons/next.png"
import { useState } from "react"
import { Select, type SingleValue } from "chakra-react-select"

type PaginationProps = {
  table: any
}

type PageOption = { label: string; value: number }

const PaginationButtons = ({ table }: PaginationProps) => {
    const currentPage = table.getState().pagination.pageIndex
    const totalPages = table.getPageCount()

    const startPage = Math.max(0, currentPage - 2)
    const endPage = Math.min(totalPages - 1, currentPage + 2)

    const pages = []
    for (let i = startPage; i <= endPage; i++) pages.push(i)

    const [jumpPage, setJumpPage] = useState<SingleValue<PageOption>>(null)
    const handleJump = (jumpOption: SingleValue<PageOption>) => {
        if (jumpOption) {
            table.setPageIndex(jumpOption.value)
            setJumpPage(null)
        }
    }

    const pageJump: PageOption[] = Array.from({ length: totalPages }, (_, i) => ({
        label: String(i + 1),
        value: i,
    }))
    
    return (
        <Box className="pages-card">
                            
            <Button
                onClick={() => table.setPageIndex(Math.max(0, currentPage - 10))}
                disabled={!table.getCanPreviousPage()}
                >
                    <img src={prevten} alt="prev10" />
            </Button>

            <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()} 
                >
                    <img src={prev}/>
            </Button>

            {startPage > 0 && (
                <>
                    <Button 
                        onClick={() => table.firstPage()}
                        className="number-buttons">
                            1
                    </Button>
                    {startPage > 1 && <p className="ellipsis">…</p>}
                </>
            )}

            {pages.map((page) => (
                <Button
                    key={page}
                    onClick={() => table.setPageIndex(page)}
                    className={
                        page === currentPage
                            ? "current-page-button"
                            : "number-buttons"
                    }
                >
                    {page + 1}
                </Button>
            ))}

            {endPage < totalPages - 1 && (
                <>
                    {endPage < totalPages - 2 && <p className="ellipsis">…</p>}
                    <Button 
                        onClick={() => table.lastPage()}
                        className="number-buttons">
                            {totalPages}
                    </Button>
                </>
            )}

            <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                    <img src={next}/>
            </Button>

            <Button
                onClick={() => table.setPageIndex(Math.min(totalPages - 1, currentPage + 10))}
                disabled={!table.getCanNextPage()}
                >
                    <img src={nextten} alt="next10" />
            </Button>

            <Select<PageOption, false>
                menuPortalTarget={document.body}
                menuPosition="fixed"
                isClearable
                isSearchable
                options={pageJump}
                placeholder="Go to page..."
                value={jumpPage}
                onChange={handleJump}
                className="page-drop"
            />
            
    
    </Box>
    )
}

export default PaginationButtons