import { Box } from "@chakra-ui/react"
import { InputGroup, Input, InputLeftElement } from "@chakra-ui/input"
import SearchIcon from "../assets/icons/search.png"
import type { TableName } from "./tables/TableConfig"
import { StudentColumns } from "./tables/StudentsTable"
import { ProgramColumns } from "./tables/ProgramsTable"
import { CollegeColumns } from "./tables/CollegesTable"
import { useEffect } from "react"
import { GenderDropdown, YearLevelDropdown, CollegesDropdown, ProgramsDropdown } from "./FieldsConfig"

type StudentFilters = {
  year_level?: number
  college_code?: string
  program_code?: string
  gender?: string
}

type FiltersProps = {
  tableName : TableName,
  onSearch: (tag: string, key: string, filters: StudentFilters) => void
  selectedTag: string
  setSelectedTag: (value: string) => void
  selectedKey: string
  setSelectedKey: (value: string) => void
  selectedFilters: StudentFilters
  setSelectedFilters: React.Dispatch<React.SetStateAction<StudentFilters>>
}

const Filters = ({tableName, onSearch, selectedTag, setSelectedTag, selectedKey, setSelectedKey, selectedFilters, setSelectedFilters}: FiltersProps) => {

    const exclude_cols = [
        "year_level",
        "program_code",
        "college_code",
        "gender",
    ]
    
    let columns =
        tableName === "students"
          ? StudentColumns.filter(
                col => !exclude_cols.includes(col.id as string)
            )
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
            onSearch(newTag, selectedKey, selectedFilters)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSelectedKey(value)
        if (value.trim() === "") {
            onSearch(selectedTag, "", selectedFilters)
        }
    }

    useEffect(() => {
        if (selectedTag && selectedKey.trim()) {
            onSearch(selectedTag, selectedKey, selectedFilters)
        }
    }, [selectedTag, selectedKey])

    const updateFilter = <K extends keyof typeof selectedFilters>(
        key: K,
        value: typeof selectedFilters[K]
        ) => {
        setSelectedFilters(prev => {
            if (value === "" || value === null) {
            const copy = { ...prev }
            delete copy[key]
            return copy
            }
            return {
            ...prev,
            [key]: value
            }
        })
    }


    return (
        <>
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
                            w="100%"
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
            {tableName === "students" && (
                <Box className="search">

                    <InputGroup>
                    <YearLevelDropdown
                        selectedYear={Number(selectedFilters.year_level || "")}
                        setSelectedYear={(v) => updateFilter("year_level", Number(v))}
                    />
                    </InputGroup>

                    <InputGroup>
                    <CollegesDropdown
                        selectedCollege={selectedFilters.college_code || ""}
                        setSelectedCollege={(v) => {
                            updateFilter("college_code", v)
                            updateFilter("program_code", "") 
                        }}
                    />
                    </InputGroup>

                    <InputGroup>
                    <ProgramsDropdown
                        selectedCollege={selectedFilters.college_code || ""}
                        selectedProgram={selectedFilters.program_code || ""}
                        setSelectedProgram={(v) => updateFilter("program_code", v)}
                    />
                    </InputGroup>

                    <InputGroup>
                    <GenderDropdown
                        selectedGender={selectedFilters.gender || ""}
                        setSelectedGender={(v) => updateFilter("gender", v)}
                    />
                    </InputGroup>
                </Box>
            )}
        </>
    )
}

export default Filters