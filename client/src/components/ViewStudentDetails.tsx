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
    const [student, setStudent] = useState<Student | null>(passedStudent ?? null);
    
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [isErrorOpen, setIsErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [isDeleted, setIsDeleted] = useState(false)

    const [programName, setProgramName] = useState("")
    const [collegeName, setCollegeName] = useState("")

    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(!passedStudent); 
    const [uploading, setUploading] = useState(false); 

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if(!student) return
        getProgramName(student.program_code)
        .then(({ program_name }) => setProgramName(program_name ?? ""))
        getCollegeName(student.college_code)
        .then(({ college_name }) => setCollegeName(college_name ?? ""))
    }, [refresh])

    const populateData = async () => {
        try {
            const fetch = await fetchObject("students", `${id_number}`)
            const data = fetch[0]
            setStudent(prev => ({ ...prev, ...data.student }))
        } catch (err) {
            if (!student) setErrorMessage("Failed to load student data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (passedStudent) return; 
        
        populateData();
    }, [id_number, passedStudent, refresh]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
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
            await handleUpdate("students", updated, id)
            setSuccessMessage(`Succesfully edited ${"students"}`)
            setIsSuccessOpen(true)
            setRefresh(prev => !prev)
            setIsEditOpen(false)
    
        } catch (err: any) {
                setErrorMessage(err.message)
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
    if (!student) return <p className="undefined">No Data Found</p>;

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
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />

                            <label htmlFor="profileUpload" className="profile-pic">
                                {uploading ? (
                                    <p className="loading-text">Loading...</p> 
                                ) : student.id_picture ? (
                                    <img src={student.id_picture} alt="Profile" className="profile-img" />
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


export default StudentDetailsPage;
