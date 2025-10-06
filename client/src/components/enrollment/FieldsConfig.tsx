import { useEffect, useState } from "react"
import { getCollegeList, getProgramList } from "@/controller/api"
import type { College } from "@/models/types/colleges"
import type { Program } from "@/models/types/programs"

// ======================
// Gender Dropdown
// =========
export const GenderDropdown = ({
  selectedGender,
  setSelectedGender,
}: {
  selectedGender: string
  setSelectedGender: (value: string) => void
}) => {
  const genders = ["Male", "Female", "Others"]

  return (
    <select
      id="gender"
      value={selectedGender}
      onChange={(e) => setSelectedGender(e.target.value)}
      className="options"
    >
      <option value="" disabled hidden>
        Select Gender
      </option>
      {genders.map((gender) => (
        <option key={gender} value={gender}>
          {gender}
        </option>
      ))}
    </select>
  )
}

// ======================
// Year Level Dropdown
// =========
export const YearLevelDropdown = ({
  selectedYear,
  setSelectedYear,
}: {
  selectedYear: number
  setSelectedYear: (value: number) => void
}) => {
  const years = [1, 2, 3, 4, 5]

  return (
    <select
      id="year"
      value={selectedYear}                   
      onChange={(e) => setSelectedYear(Number(e.target.value))}
      className="options"
    >

      <option value="" disabled hidden>
        Select Year Level
      </option>
      {years.map((ylevel) => (
        <option key={ylevel} value={ylevel}>
          {ylevel}
        </option>
      ))}
    </select>
  )
}


// ======================
// Colleges Dropdown
// =========
export const CollegesDropdown = ({
  selectedCollege,
  setSelectedCollege,
}: {
  selectedCollege: string
  setSelectedCollege: (value: string) => void
}) => {
  const [listColleges, setColleges] = useState<College[]>([])

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await getCollegeList()
        setColleges(response.data)
      } catch (err) {
        console.error("Failed to fetch colleges:", err)
      }
    }
    fetchColleges()
  }, [])

  return (
    <select
      id="college"
      value={selectedCollege}
      onChange={(e) => setSelectedCollege(e.target.value)}
      className="options"
    >
      <option value="" disabled hidden>
        Select College
      </option>
      {listColleges.map((college) => (
        <option key={college.college_code} value={college.college_code}>
          {college.college_name}
        </option>
      ))}
    </select>
  )
}

// ======================
// Programs Dropdown
// =========
export const ProgramsDropdown = ({
  selectedCollege,
  selectedProgram,
  setSelectedProgram,
}: {
  selectedCollege: string
  selectedProgram: string
  setSelectedProgram: (value: string) => void
}) => {
  const [listPrograms, setPrograms] = useState<Program[]>([])

  useEffect(() => {
    if (!selectedCollege) {
      setPrograms([])
      return
    }
    const fetchPrograms = async () => {
      try {
        const response = await getProgramList(selectedCollege)
        setPrograms(response.data)
      } catch (err) {
        console.error("Failed to fetch programs:", err)
      }
    }
    fetchPrograms()
  }, [selectedCollege])

  return (
    <select
      id="program"
      value={selectedProgram}
      onChange={(e) => setSelectedProgram(e.target.value)}
      className="options"
      disabled={!selectedCollege} // disabled until college is picked
    >
      <option value="" disabled hidden>
        Select Program
      </option>
      {listPrograms.map((program) => (
        <option key={program.program_code} value={program.program_code}>
          {program.program_name}
        </option>
      ))}
    </select>
  )
}
