import type { ColumnDef } from "@tanstack/react-table"
import EditIcon from "../../assets/icons/edit-idle.png"
import DeleteIcon from "../../assets/icons/trash-bin_close.png"
import ViewIcon from "../../assets/icons/view-idle.png"
import '../../style/App.css'

const API_BASE = "http://localhost:8080"

export const ActionsColumns: ColumnDef<any>[] = [
  {
        header: "Actions",
        accessorKey: "actions",
        cell: ({row}) => {
            const original = row.original


            // ==============
            // VIEW IMPLEMENT
            // =======
            const handleView = async () => {
              console.log(original.id_number)
              try {
                const response = await fetch (`${API_BASE}/api/students/${original.id_number}`)
                const data = await response.json()
                console.log("View data: ", data)
              } catch (error){
                console.error("Error: ", error)
              }
            }

            const handleEdit = async () => {
              try {
                const response = await fetch (`/api/students/${original.id_number}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    first_name: original.first_name,
                    middle_name: original.middle_name,
                    last_name: original.last_name,
                    gender: original.gender,
                    program: original.program_code,
                  }),
                })
                const data = await response.json()
                console.log("View data: ", data)
              } catch (error){
                console.error("Error: ", error)
              }
            }

            const handleDelete = async () => {
              if (!window.confirm("Are you sure you want to delete this?")) return;
              try {
                const res = await fetch(`/api/students/${original.id_number}`, {
                  method: "DELETE",
                });
                if (res.ok) {
                  console.log("Delete success!");
                  // optional: refetch or remove row from state
                }
              } catch (err) {
                console.error("Error deleting:", err);
              }
            }

            return (
              <div>
                <img
                  src={ViewIcon}
                  alt="View"
                  className="view-button"
                  onClick={(handleView)}
                />
                <img
                  src={EditIcon}
                  alt="Edit"
                  className="edit-button"
                  onClick={handleEdit}
                />
                <img
                  src={DeleteIcon}
                  alt="Delete"
                  className="delete-button"
                  onClick={handleDelete}
                />
              </div>
            )
        },
        meta: { flex: 1 }
    },
]