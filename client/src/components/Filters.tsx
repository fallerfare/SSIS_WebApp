import { Box } from "@chakra-ui/react"
import { InputGroup, Input, InputLeftElement } from "@chakra-ui/input"
import SearchIcon from "../assets/icons/search.png"
import type { ColumnFiltersState } from "@tanstack/react-table"

type FiltersProps = {
  columnFilters: ColumnFiltersState
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
}

const Filters = ({columnFilters, setColumnFilters}: FiltersProps) => {
    const filterName = 
        columnFilters.find(
            (f: any) => f.id === "id_number")?.value || ""

    const onFilterChange = (id: string, value: string) => 
        setColumnFilters(
            (prev: any) => 
                prev.filter((f: any) => f.id !== id).concat({
                    id, value
            })
    )
    return (
        <Box className="search">
            <InputGroup>
                <InputLeftElement pointerEvents={"none"}>
                    <img  src={SearchIcon}
                            className="search-icon"/>
                </InputLeftElement>
                <Input
                        type="text"
                        variant="filled"
                        placeholder = "Search..."
                        borderRadius={5}
                        
                        value={filterName as string}
                        onChange={
                            (e) => onFilterChange('id_number', e.target.value)
                        }
                    />
            </InputGroup>
        </Box>
    )
}

export default Filters