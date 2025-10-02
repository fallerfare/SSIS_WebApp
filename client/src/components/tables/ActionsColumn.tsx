import type { ColumnDef } from "@tanstack/react-table"
import type { Student } from "../../models/types/students"
import type { Program } from "../../models/types/programs"
import type { College } from "../../models/types/colleges"

import EditIcon from "../../assets/icons/edit-idle.png"
import DeleteIcon from "../../assets/icons/trash-bin_close.png"
import ViewIcon from "../../assets/icons/view-idle.png"
import '../../style/App.css'

const API_BASE = "http://localhost:8080"

type TableName = "students" | "programs" | "colleges"

type TableRow<T extends TableName> =
  T extends "students" ? Student :
  T extends "programs" ? Program :
  T extends "colleges" ? College :
  never

export function getActionsColumns<T extends TableName>(
  tableName: T,
  onView: (data: any) => void
): ColumnDef<TableRow<T>>[] {
  const ActionsColumns: ColumnDef<TableRow<T>>[] = [
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        const original = row.original
 
        const handleView = async () => {
          try {
            const res = await fetch(`${API_BASE}/api/${tableName}/${getId(original, tableName)}`)
            const data = await res.json()
            onView(Array.isArray(data) ? data[0] : data)
            console.log("View data: ", data)
          } catch (error) {
            console.error("Error: ", error)
          }
        }

        const handleEdit = async () => {
          try {
            const res = await fetch(`${API_BASE}/api/${tableName}/${getId(original, tableName)}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(original), 
            })
            const data = await res.json()
            console.log("Edit response: ", data)
          } catch (error) {
            console.error("Error: ", error)
          }
        }

        const handleDelete = async () => {
          if (!window.confirm("Are you sure you want to delete this?")) return
          try {
            const res = await fetch(`${API_BASE}/api/${tableName}/${getId(original, tableName)}`, {
              method: "DELETE",
            })
            if (res.ok) {
              console.log("Delete success!")
              // TODO: update UI
            }
          } catch (err) {
            console.error("Error deleting:", err)
          }
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

function getId<T extends TableName>(row: TableRow<T>, tableName: T): string {
  switch (tableName) {
    case "students": return (row as Student).id_number
    case "programs": return (row as Program).program_code
    case "colleges": return (row as College).college_code
  }
}
