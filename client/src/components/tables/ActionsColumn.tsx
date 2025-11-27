import type { ColumnDef } from "@tanstack/react-table"
import type { Student } from "../../models/types/students"
import type { Program } from "../../models/types/programs"
import type { College } from "../../models/types/colleges"

import EditIcon from "../../assets/icons/edit-idle.png"
import DeleteIcon from "../../assets/icons/trash-bin_close.png"
import ViewIcon from "../../assets/icons/view-idle.png"
import '../../style/App.css'
import type { UserData } from "@/models/types/UserData"

import { fetchObject } from "@/controller/api"

type TableName = "students" | "programs" | "colleges" | "users"

type TableRow<T extends TableName> =
  T extends "students" ? Student :
  T extends "programs" ? Program :
  T extends "colleges" ? College :
  T extends "users" ? UserData :
  never

export function getActionsColumns<T extends TableName>(
  tableName: T,
  onView: (data: any) => void,
  onEdit: (data:any) => void,
  onDelete: (data:any) => void
): ColumnDef<TableRow<T>>[] {
  const ActionsColumns: ColumnDef<TableRow<T>>[] = [
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        const original = row.original

        const id = getId(original, tableName)
 
        //REDIRECT
        const handleView = async () => {
          try {
            const data = await fetchObject(tableName, id)
            onView(Array.isArray(data) ? data[0] : data)
          } catch (error) {
            console.error("Error: ", error)
          }
        }

        const handleEdit = async () => {
          try {
            const data = await fetchObject(tableName, id)
            onEdit(Array.isArray(data) ? data[0] : data)
          } catch (error) {
            console.error("Error: ", error)
          }
        }

        const handleDelete = async () => {
          onDelete(original)
        }

        return (
          <div>
            <img src={ViewIcon} alt="View" className="view-button" onClick={handleView} />
            <img src={EditIcon} alt="Edit" className="edit-button" onClick={handleEdit} />
            <img src={DeleteIcon} alt="Delete" className="delete-button" onClick={handleDelete} />
          </div>
        )
      },
      meta: { flex: 1 },
    },
  ]

  return ActionsColumns
}

function getId<T extends TableName>(row: TableRow<T>, tableName: T): string | number | undefined{
  switch (tableName) {
    case "students": return (row as Student).id_number
    case "programs": return (row as Program).program_code
    case "colleges": return (row as College).college_code
    case "users": return (row as UserData).id_number
  }
}
