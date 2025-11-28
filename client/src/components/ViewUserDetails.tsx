import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/App.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
import EditModal from "./popups/EditDialog";
import ErrorPopup from "./popups/ErrorsDialog";
import SuccessPopup from "./popups/Success";
import EditIcon from "../assets/icons/edit-idle.png"
import DeleteIcon from "../assets/icons/trash-bin_close.png"
import type { UserData } from "@/models/types/UserData";
import { deleteImage, fetchMe, handleLogout, handleUpdate, uploadImage } from "@/controller/api";
import LogOutModal from "./popups/LogOutDialog";
import DeleteModal from "./popups/DeleteDialog";

interface UserDetailsPageProps {
    onLogout?: () => void;
}

const userDetailsPage = ({ onLogout }: UserDetailsPageProps) => {

    const navigate = useNavigate();

    const [user, setUser] = useState<UserData | null>(null);
    
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isLogOutOpen, SetIsLogOutOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [isErrorOpen, setIsErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [isLoggedOut, setIsLoggedOut] = useState(false)

    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(!user); 
    const [uploading, setUploading] = useState(false); 

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const populateData = async () => {
        setLoading(true)
        try {
            const res = await fetchMe()
            if (res) {
                setUser(res.user)
            } else {
                setErrorMessage(res.error)
                return
            }
        } catch (err) {
            setErrorMessage("Failed to load user session data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        populateData();
    }, [refresh]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null

        if (!file) return
        const maxSize = 5 * 1024 * 1024

        if (file.size > maxSize) {
            setErrorMessage("File size must be under 5MB.")
            setIsErrorOpen(true)
            e.target.value = ""
            return;
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
            setErrorMessage("Only JPEG, JPG and PNG images are allowed.");
            setIsErrorOpen(true);
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
    };

    const handleImageClear = async () => {
        if (!selectedFile || !user) return

        try{
            setSelectedFile(null);
            const input = document.getElementById("profileUpload") as HTMLInputElement;
            if (input) input.value = "";
        } catch (err) {
            setErrorMessage("Failed to clear Image!")
            setIsErrorOpen(true)
        } finally {
            setUploading(false)
            setSelectedFile(null)
        }
    }

    const handleImageRemove = () => {
        setIsDeleteOpen(true)
    }

    const handleConfirmImageRemove = async () => {
        if (!user || !user.id_number) return

        try{
            setUploading(true)
            const result = await deleteImage("users", user.id_number);
            setUser(prev => prev ? { ...prev, id_picture: undefined } : null);
            setSuccessMessage(result.message)
            setIsSuccessOpen(true)
            setTimeout(() => setRefresh(prev => !prev), 1500)
        } catch (err: any) {
            setErrorMessage(err.error)
            setIsErrorOpen(true)
        } finally {
            setUploading(false)
            setSelectedFile(null)
        }
    }
    
    const handleImageUpload = async () => {
        if (!selectedFile || !user || !user.id_number) return

        try{
            setUploading(true)
            const result = await uploadImage("users", selectedFile, user.id_number);
            setUser(prev => prev ? { ...prev, id_picture: result.url } : null)
            setSuccessMessage("Successfully uploaded Image!")
            setIsSuccessOpen(true)
            setTimeout(() => setRefresh(prev => !prev), 1500)
        } catch (err) {
            setErrorMessage("Failed to upload Image!")
            setIsErrorOpen(true)
        } finally {
            setUploading(false)
            setSelectedFile(null)
        }
    }

    const handleDetailsEdit = () => {
        setIsEditOpen(true)
    }

    const handleDetailsDelete = () => {
        SetIsLogOutOpen(true)
    }

    const handleConfirmEdit = async (updated: any) => {
        const id = updated.id_number

        try {
            const res = await handleUpdate("users", updated, id)

            if(res.success){
                setSuccessMessage(res.message)
                setIsSuccessOpen(true)
                setRefresh(prev => !prev)
                setIsEditOpen(false)
            }
            else {
                let details = "";

                if (res.message && typeof res.message === "object") {
                    details = Object.entries(res.message)
                        .map(([field, msgs]) => {
                            const arr = Array.isArray(msgs) ? msgs : [String(msgs)];
                            return `${field}: ${arr.join(", ")}`;
                        })
                        .join("\n");
                } else {
                    details = res.error || "Unknown error";
                }

                setErrorMessage(details);
                setIsErrorOpen(true);
            }

        } catch (err: any) {
            setErrorMessage(err.error)
            setIsErrorOpen(true)
        } 
    }
    
    const handleConfirmLogOut = async () => {
        try {
            const response = await handleLogout()
            if (response.success) {
                setIsLoggedOut(true)
                setSuccessMessage(response.message)
                setIsSuccessOpen(true)
                if (onLogout) onLogout()
            }
    
        } catch (err: any) {
                setErrorMessage(err.message)
                setIsErrorOpen(true)
        }
    }

    if (loading) {
        console.log("Ye, loaing")
    }
    if (!user) {
        return
    }

    const hasProfilePic = user?.id_picture && user.id_picture !== "None";

    return (
        <>
            <div className="page-container">
                <div className="content-container">
                    {/* BASIC CARD */}
                    <div className="card basic-card">
                    <div className="card-flex">
                        {/* PROFILE PIC */}
                        <div className="profile-pic-wrapper">

                            <input
                                type="file"
                                id="profileUpload"
                                accept="image/.jpg, .jpeg, .png"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />

                            <label
                                htmlFor="profileUpload"
                                className="profile-pic"
                                onClick={() => document.getElementById("profileUpload")?.click()}
                            >
                                {uploading ? (
                                    <p className="loading-text">Loading...</p>
                                ) : selectedFile ? (
                                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="profile-img" />
                                ) : hasProfilePic ? (
                                    <img src={user.id_picture} alt="Profile" className="profile-img" />
                                ) : (
                                    <i className="bi bi-person profile-icon"></i>
                                )}

                            </label>

                            <div className="upload_button_row">

                                <button
                                    className="button-upload"
                                    onClick={() => {
                                        if (!selectedFile) {
                                            document.getElementById("profileUpload")?.click();
                                        } else {
                                            handleImageUpload();
                                        }
                                    }}
                                    disabled={uploading}
                                >
                                    {selectedFile ? "Confirm" : "Upload"}
                                </button>

                                <button
                                    className="button-clear"
                                    onClick={() => {
                                        if (!selectedFile && user?.id_picture) {
                                            console.log("Handle Image Remove")
                                            handleImageRemove()
                                        } else if (selectedFile) {
                                            console.log("Handle Image Clear")
                                            handleImageClear()
                                        }
                                    }}
                                    
                                    disabled={(!selectedFile && !hasProfilePic)}
                                >
                                    {selectedFile ? "Clear" : "Remove"}
                                </button>
                            </div>

                        </div>


                        {/* INFO */}
                        <div className="info-section">
                            <div className="card-head">
                                <h1 className="user-name">
                                    {user.user_name} 
                                </h1>
                                <button className="button-edit" onClick={handleDetailsEdit}>
                                    <img src={EditIcon} alt="Edit" className="edit-button-details"/>
                                    Edit Details
                                </button>
                            </div>
                            <p className="user-maininfo">ID: {user.id_number}</p>
                            </div>
                        </div>
                    </div>

                    {/* PERSONAL INFO */}
                    <div className="card info-card">
                        <div className="card-head">
                            <h2 className="section-title">Personal Information</h2>
                        </div>
                        <div className="grid-4">
                            <Field label="Email" value={user.user_email || "N/A"} />
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <button className="button-remove" onClick={handleDetailsDelete}>
                        <img src={DeleteIcon} alt="Delete" className="delete-button-details"/>
                        Log out
                    </button>
                </div>
            </div>

            <EditModal 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)}
                editData={user}
                onConfirm={handleConfirmEdit}
            >
            </EditModal>

            <DeleteModal 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)}
                deleteData={user}
                onConfirm={handleConfirmImageRemove}
                customMessage={"Are you sure you want to remove this profile picture?"}
                >
            </DeleteModal>

            <LogOutModal
                isOpen={isLogOutOpen}
                onClose={() => SetIsLogOutOpen(false)}
                onConfirm={handleConfirmLogOut}
            ></LogOutModal>

            <ErrorPopup
                isOpen={isErrorOpen}
                message={errorMessage}
                onClose={() => setIsErrorOpen(false)}
            />
    
            <SuccessPopup
                isOpen={isSuccessOpen} 
                message={successMessage}
                onClose={() => {
                    setIsSuccessOpen(false);
                    if (isLoggedOut) {
                        setIsLoggedOut(false)
                        navigate("/login");
                    }
                }}
            />

        </>
    );
};

const Field = ({
    label,
    value,
    large,
    style,
}: {
    label: string;
    value: any;
    large?: boolean;
    style?: React.CSSProperties;
}) => (
    <div className="field-container" style={style}>
        <p className="field-label">{label}:</p>
        <p className={`field-value ${large ? "large-text" : ""}`}>{value}</p>
    </div>
);


export default userDetailsPage;
