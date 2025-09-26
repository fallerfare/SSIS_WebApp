import type { ColumnDef } from "@tanstack/react-table"
import EditIcon from "../../assets/icons/edit-idle.png"
import DeleteIcon from "../../assets/icons/trash-bin_close.png"
import ViewIcon from "../../assets/icons/view-idle.png"
import '../../style/App.css'

export const ActionsColumns: ColumnDef<any>[] = [
  {
        header: "Actions",
        accessorKey: "actions",
        cell: ({row}) => {
            const original = row.original
          // TO DO: Try transferring this to Table
          //            Implement View, Edit and Delete
            return (
              <div>
                <img
                  src={ViewIcon}
                  alt="View"
                  className="view-button"
                  onClick={() => console.log("View clicked!", original)}
                />
                <img
                  src={EditIcon}
                  alt="Edit"
                  className="edit-button"
                  onClick={() => console.log("Edit clicked!", original)}
                />
                <img
                  src={DeleteIcon}
                  alt="Delete"
                  className="delete-button"
                  onClick={() => console.log("Delete clicked!", original)}
                />
              </div>
            )
        },
        meta: { flex: 1 }
    },
]