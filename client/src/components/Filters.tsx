import { Box } from "@chakra-ui/react"
import { InputGroup, Input, InputLeftElement } from "@chakra-ui/input"
import SearchIcon from "../assets/icons/search.png"
import type { TableName } from "./tables/TableConfig"
import { StudentColumns } from "./tables/StudentsTable"
import { ProgramColumns } from "./tables/ProgramsTable"
import { CollegeColumns } from "./tables/CollegesTable"
import { useEffect } from "react"

type FiltersProps = {
  tableName : TableName,
  onSearch : (tag: string, key: string) => void
  selectedTag: string
  setSelectedTag: (value: string) => void
  selectedKey: string
  setSelectedKey: (value: string) => void
}

const Filters = ({tableName, onSearch, selectedTag, setSelectedTag, selectedKey, setSelectedKey}: FiltersProps) => {

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
        setSelectedTag(newTag)
        if (selectedKey.trim()) {
            onSearch(newTag, selectedKey)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSelectedKey(value)
        if (value.trim() === "") {
            onSearch(selectedTag, "")
        }
    }

    useEffect(() => {
        if (selectedTag && selectedKey.trim()) {
            onSearch(selectedTag, selectedKey)
        }
    }, [selectedTag, selectedKey])

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
                        value={selectedKey as string}
                        onChange={ handleSearchChange }
                    />
            </InputGroup>
            <InputGroup>
                <select
                        id = "search_tag"
                        value={selectedTag}
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

export default Filters