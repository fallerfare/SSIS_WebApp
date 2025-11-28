import { Box } from "@chakra-ui/react"
import { InputGroup, Input, InputLeftElement } from "@chakra-ui/input"
import SearchIcon from "../assets/icons/search.png"
import type { TableName } from "./tables/TableConfig"
import { StudentColumns } from "./tables/StudentsTable"
import { ProgramColumns } from "./tables/ProgramsTable"
import { CollegeColumns } from "./tables/CollegesTable"
import { useEffect } from "react"

type MultFiltersProps = {
  tableName : TableName,
  onSearch : (tags: Array<string>, keys: Array<string>) => void
  selectedTags: Array<string>
  setSelectedTags: (value: string) => void
  selectedKeys: Array<string>
  setSelectedKeys: (value: string) => void
}

const MultFilters = ({tableName, onSearch, selectedTags, setSelectedTags, selectedKeys, setSelectedKeys}: MultFiltersProps) => {

    let columns =
        tableName === "students"
          ? StudentColumns
          : tableName === "programs"
          ? ProgramColumns
          : CollegeColumns

    const columnOptions = columns.map(col => ({
        id: col.id,
        header:
            typeof col.header === "string"
                ? col.header
                : String(col.header ?? col.id)
    }))

    useEffect(() => {
        columns =
            tableName === "students"
            ? StudentColumns
            : tableName === "programs"
            ? ProgramColumns
            : CollegeColumns
    }, [tableName])
    
    const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTag = e.target.value
        setSelectedTags(newTag)
        if (selectedKeys.trim()) {
            onSearch(newTag, selectedKeys)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSelectedKeys(value)
        if (value.trim() === "") {
            onSearch(selectedTags, "")
        }
    }

    useEffect(() => {
        if (selectedTags && selectedKeys.trim()) {
            onSearch(selectedTags, selectedKeys)
        }
    }, [selectedTags, selectedKeys])

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
                        value={selectedKeys as string}
                        onChange={ handleSearchChange }
                    />
            </InputGroup>
            <InputGroup>
                <select
                        id = "search_tag"
                        value={selectedTags}
                        onChange={handleColumnChange}
                        className="options"
                      >
                        <option value="" disabled hidden>
                            Select Filter
                        </option>
                        {columnOptions.map(col => (
                          <option key={col.id} value={col.id}>
                            {col.header}
                          </option>
                        ))}
                </select>
            </InputGroup>
        </Box>
    )
}

export default MultFilters