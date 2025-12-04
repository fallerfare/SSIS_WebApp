import type { Student } from "../models/types/students";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom"
import { fetchObject, getCollegeName, getProgramName, handleDelete, handleUpdate, uploadImage } from "../controller/api";
import "../style/App.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
import EditModal from "./popups/EditDialog";
import DeleteModal from "./popups/DeleteDialog";
import ErrorPopup from "./popups/ErrorsDialog";
import SuccessPopup from "./popups/Success";
import EditIcon from "../assets/icons/edit-idle.png"
import DeleteIcon from "../assets/icons/trash-bin_close.png"

const StudentDetailsPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const {id_number} = useParams();
    const passedStudent = location.state?.student as Student | undefined;
    const [student, setStudent] = useState<Student | null>(null);
    
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [isErrorOpen, setIsErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [isDeleted, setIsDeleted] = useState(false)
    const [handlingImage, setHandlingImage] = useState(false)

    const [programName, setProgramName] = useState("")
    const [collegeName, setCollegeName] = useState("")

    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(!passedStudent); 
    const [uploading, setUploading] = useState(false); 

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const populateData = async () => {
        if (!id_number) return;
        setLoading(true);
        try {
            const data = await fetchObject("students", `${id_number}`);
            if (data) {
                setStudent(data);
                getProgramName(data.program_code).then(({ program_name }) => setProgramName(program_name ?? ""));
                getCollegeName(data.college_code).then(({ college_name }) => setCollegeName(college_name ?? ""));
            } else {
                setErrorMessage("Student data not found.");
                setIsErrorOpen(true);
            }
        } catch (err) {
            setErrorMessage("Failed to load student data.");
        
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (passedStudent && !student) {
            setStudent(passedStudent); 
        }
        populateData();  
    }, [id_number, refresh]);


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


    const handleImageUpload = async () => {
        if (!selectedFile || !student) return

        try{
            setUploading(true)
            const result = await uploadImage("students", selectedFile, student.id_number);
            setStudent(prev => prev ? { ...prev, id_picture: result.url } : null)
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

    const handleImageClear = async () => {
        if (!selectedFile || !student) return

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
        setHandlingImage(true)
        setIsDeleteOpen(true)
    }

    const handleDetailsEdit = () => {
        setIsEditOpen(true)
    }

    const handleDetailsDelete = () => {
        setIsDeleteOpen(true)
    }

    const handleConfirmImageRemove = () => {
        if (!student) return

        const updated = { ...student, id_picture: "NULL" }
        setStudent(updated);
        handleConfirmEdit(updated)
        setRefresh(prev => !prev)
    }

    const handleConfirmEdit = async (updated: any) => {
        const id = updated.id_number
        try {
            const res = await handleUpdate("students", updated, id)
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
    
    const handleConfirmDelete = async () => {
        const id = student?.id_number
        if (!id) return
        try {
            const response = await handleDelete("students", id)

            if (!response.success) {
                if (response.error === "ForeignKeyViolation") {
                    setErrorMessage(response.message || "Delete restricted.")
                    setIsErrorOpen(true)
                } else {
                    setErrorMessage(response.message || "An unexpected error occurred.")
                    setIsErrorOpen(true)
                }
            } else {
            setSuccessMessage(`Succesfully deleted ${"students"}`)
            setIsSuccessOpen(true)
            setRefresh(prev => !prev)
            }
        } catch (err: any) {
            setErrorMessage(err.message)
            setIsErrorOpen(true)
        } finally {
            setIsDeleted(true)
            setIsDeleteOpen(false)
        }
    }


    if (loading) {
        console.log("Ye, loaing")
    }
    if (!student) {
        return
    }

    return (
        <>
            <div className="page-container">
                <div className="content-container">
                    {/* BACK BUTTON */}
                    <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                    >
                    <i className="bi bi-arrow-left"></i>
                    Back to Students
                    </button>
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
                                    <p className="loading-text">Uploading...</p>
                                ) : selectedFile ? (
                                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="profile-img" />
                                ) : student?.id_picture !== null ? (
                                    <img src={student.id_picture} alt="Profile" className="profile-img" />
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
                                    {selectedFile ? "Confirm Upload" : "Upload"}
                                </button>

                                <button
                                    className="button-clear"
                                    onClick={() => {
                                        if (!selectedFile && student?.id_picture) {
                                            console.log("Handle Image Remove")
                                            handleImageRemove()
                                        } else if (selectedFile) {
                                            console.log("Handle Image Clear")
                                            handleImageClear()
                                        }
                                    }}
                                    
                                    disabled={(!selectedFile && (!student?.id_picture || student?.id_picture === "NULL"))}
                                >
                                    {selectedFile ? "Clear" : "Remove"}
                                </button>
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="info-section">
                            <div className="card-head">
                                <h1 className="student-name">
                                    {student.first_name} {student.middle_name ?? ""} {student.last_name}
                                </h1>
                                <button className="button-edit" onClick={handleDetailsEdit}>
                                    <img src={EditIcon} alt="Edit" className="edit-button-details"/>
                                    Edit Details
                                </button>
                            </div>
                            <p className="student-maininfo">ID: {student.id_number}</p>
                            <p className="student-maininfo">
                                Program: {student.program_code}
                            </p>
                            <p className="student-maininfo">
                                College: {student.college_code}
                            </p>
                            </div>
                        </div>
                    </div>

                    {/* PERSONAL INFO */}
                    <div className="card info-card">
                        <div className="card-head">
                            <h2 className="section-title">Personal Information</h2>
                        </div>
                        <div className="grid-4">
                            <Field label="First Name" value={student.first_name} />
                            <Field label="Middle Name" value={student.middle_name || "N/A"} />
                            <Field label="Last Name" value={student.last_name} />
                            <Field label="Gender" value={student.gender} />
                            <Field label="Email" value={student.email} />
                        </div>
                    </div>

                    {/* ACADEMIC INFO */}
                    <div className="card info-card">
                        <div className="card-head">
                            <h2 className="section-title">Academic Information</h2>
                        </div>
                            <div className="grid-2">
                                <Field 
                                    label="Year Level" 
                                    value={String(student.year_level)} 
                                    style={{ gridColumn: 1, gridRow: 1 }} 
                                />
                                <Field 
                                    label="Program Code" 
                                    value={student.program_code} 
                                    style={{ gridColumn: 1, gridRow: 2 }} 
                                />
                                <Field 
                                    label="Program Name" 
                                    value={programName} 
                                    style={{ gridColumn: 2, gridRow: 2 }} 
                                />
                                <Field 
                                    label="College Code" 
                                    value={student.college_code} 
                                    style={{ gridColumn: 1, gridRow: 3 }} 
                                />
                                <Field 
                                    label="College Name" 
                                    value={collegeName} 
                                    style={{ gridColumn: 2, gridRow: 3, gridColumnEnd: 3 }} 
                                />
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
                editData={student}
                onConfirm={handleConfirmEdit}
            >
            </EditModal>
    
            <DeleteModal 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)}
                deleteData={student}
                onConfirm={handlingImage ? handleConfirmImageRemove : handleConfirmDelete}
                customMessage={handlingImage ? "Are you sure you want to remove this profile picture?" : undefined}
                >
            </DeleteModal>

            <ErrorPopup
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                message={errorMessage}
            />
    
            <SuccessPopup
                isOpen={isSuccessOpen} 
                message={successMessage}
                onClose={() => {
                    setIsSuccessOpen(false);
                    if (isDeleted) {
                    navigate(-1);
                    }
                    setRefresh(prev => !prev)
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


export default StudentDetailsPage;
