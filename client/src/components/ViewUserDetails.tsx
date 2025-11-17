import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/App.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
import EditModal from "./popups/EditDialog";
import DeleteModal from "./popups/DeleteDialog";
import ErrorPopup from "./popups/ErrorsDialog";
import SuccessPopup from "./popups/Success";
import EditIcon from "../assets/icons/edit-idle.png"
import DeleteIcon from "../assets/icons/trash-bin_close.png"
import type { UserData } from "@/models/types/UserData";
import { fetchObject, handleDelete, handleUpdate, uploadImage } from "@/controller/api";

    const userDetailsPage = () => {

        const navigate = useNavigate();

        const [user, setUser] = useState<UserData | null>();
        
        const [isEditOpen, setIsEditOpen] = useState(false)
        const [isDeleteOpen, setIsDeleteOpen] = useState(false)

        const [isErrorOpen, setIsErrorOpen] = useState(false)
        const [errorMessage, setErrorMessage] = useState<string>("")

        const [isSuccessOpen, setIsSuccessOpen] = useState(false)
        const [successMessage, setSuccessMessage] = useState<string>("")

        const [isDeleted, setIsDeleted] = useState(false)

        const [refresh, setRefresh] = useState(false)
        const [loading, setLoading] = useState(!user); 
        const [uploading, setUploading] = useState(false); 

        const [selectedFile, setSelectedFile] = useState<File | null>(null);

        const populateData = async () => {
            if (!user) return
            try {
                const fetch = await fetchObject("users", `${user.user_id}`)
                const data = fetch[0]
                setUser(prev => ({ ...prev, ...data.user }))
            } catch (err) {
                if (!user) setErrorMessage("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        }

        useEffect(() => {
            populateData();
        }, [user, refresh]);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] ?? null;
            setSelectedFile(file);
        };


        const handleImageUpload = async () => {
            if (!selectedFile || !user) return

            try{
                setUploading(true)
                const result = await uploadImage("users", selectedFile, user.user_id);
                setUser(prev => prev ? { ...prev, id_picture: result.url } : null)
                setSuccessMessage("Successfully uploaded Image!")
                setIsSuccessOpen(true)
                setRefresh(prev => !prev)
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
            setIsDeleteOpen(true)
        }

        const handleConfirmEdit = async (updated: any) => {
            const id = updated.id_number
            try {
                await handleUpdate("users", updated, id)
                setSuccessMessage(`Succesfully edited ${"users"}`)
                setIsSuccessOpen(true)
                setRefresh(prev => !prev)
                setIsEditOpen(false)
        
            } catch (err: any) {
                    setErrorMessage(err.message)
                    setIsErrorOpen(true)
            } 
        }
        
        const handleConfirmDelete = async () => {
            const id = user?.user_id
            if (!id) return
            try {
                const response = await handleDelete("users", id)

                if (!response.success) {
                    if (response.error === "ForeignKeyViolation") {
                        setErrorMessage(response.message || "Delete restricted.")
                        setIsErrorOpen(true)
                    } else {
                        setErrorMessage(response.message || "An unexpected error occurred.")
                        setIsErrorOpen(true)
                    }
                } else {
                setSuccessMessage(`Succesfully deleted ${"users"}`)
                setIsSuccessOpen(true)
                setRefresh(prev => !prev)
                }
            } catch (err) {
                setErrorMessage("Server connection error. Please try again.")
                setIsErrorOpen(true)
            } finally {
                setIsDeleted(true)
                setIsDeleteOpen(false)
            }
        }

        if (loading) return <p className="loading">Loading...</p>;
        if (errorMessage) return <p className="error">{errorMessage}</p>;
        if (!user) return <p className="undefined">No Data Found</p>;

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
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />

                                <label htmlFor="profileUpload" className="profile-pic">
                                    {uploading ? (
                                        <p className="loading-text">Loading...</p> 
                                    ) : user.user_picture ? (
                                        <img src={user.user_picture} alt="Profile" className="profile-img" />
                                    ) : (
                                        <i className="bi bi-person profile-icon"></i>
                                    )}
                                </label>

                                {selectedFile && !uploading && (
                                    <button className="button-upload" onClick={handleImageUpload}>
                                        Upload
                                    </button>
                                )}
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
                                <p className="user-maininfo">ID: {user.user_id}</p>
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
                            Unenroll
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
                    onConfirm={handleConfirmDelete}
                >
                </DeleteModal>

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
                        if (isDeleted) {
                        navigate(-1);
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
