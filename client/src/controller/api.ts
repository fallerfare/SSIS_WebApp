import type { College } from "@/models/types/colleges"
import type { Program } from "@/models/types/programs"
import { fetchCsrf } from "./fetchCsrf"

const API_BASE = "http://localhost:8080"

type TableName = "students" | "programs" | "colleges"

export async function fetchTableData(table: string,
                                                        page: number,
                                                        limit: number,
                                                        tag: string,
                                                        key: string,
                                                        sort: string,
                                                        order: string
                                                        ) {
                                                            
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        tag: tag.toString(),
        key: key.toString(),
        sort: sort.toString(),
        order: order.toString()
    })

    const response = await fetch(`${API_BASE}/table/${table}?${params}`)
    if (!response.ok) throw new Error("Failed to fetch data")
    return response.json()
}

export async function getSession(): Promise<{ isLoggedIn: boolean; user_name? : string }> {
    const response = await fetch(`${API_BASE}/api/me`, {
        credentials: "include",
    })

    if (!response.ok) {
        return { isLoggedIn: false }
    }

    return response.json()
}

export async function getCollegeName(college_code: string) {
    const response = await fetch(`${API_BASE}/view/students/collegeName/${college_code}`)
    if (!response.ok) throw new Error("Failed to fetch data")
    return response.json()
}

export async function getProgramName(program_code: string) {
    const response = await fetch(`${API_BASE}/view/students/programName/${program_code}`)
    if (!response.ok) throw new Error("Failed to fetch data")
    return response.json()
}

export async function getCollegeList(): Promise<{ data: College[] }>{

    const response = await fetch(`${API_BASE}/table/colleges`)
    if (!response.ok) throw new Error("Failed to fetch data")
    return response.json()
}

export async function getProgramList(college_code: string): Promise<{ data: Program[] }>{

     const params = new URLSearchParams({
        tag: "college_code",
        key: college_code,
    })

    const response = await fetch(`${API_BASE}/table/programs?${params}`)
    if (!response.ok) throw new Error("Failed to fetch data")
    return response.json()
}

export async function handleInsert<T>(tableName: TableName, data: T) {
    
    const { csrf_token } = await fetchCsrf()

    const response = await fetch(`${API_BASE}/create/${tableName}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
        },
        credentials: "include",
        body: JSON.stringify(data),
    })

    if (!response.ok) {

        const errorData = await response.json()
        let message = ""
        
        if (response.status === 400 && errorData.details && typeof errorData.details === "object") {
            const details = errorData.details as Record<string, string[]>
            const allMessages = Object.values(details)
                .flat()                    
                .join("\n")   

            throw new Error(allMessages)
        }

        else if (response.status === 409 && errorData.details && typeof errorData.details === "string"){
            message = errorData.details
            throw new Error(message)
        }
    }

  return response.json();
}

export async function handleUpdate<T>(tableName: TableName, updated: T, id: string) {

    const { csrf_token } = await fetchCsrf()

    const response = await fetch(`${API_BASE}/edit/${tableName}/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
        },
        credentials: "include",
        body: JSON.stringify(updated),
    })


    if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 400 && errorData.details) {
        const details = errorData.details as Record<string, string[]>
        const allMessages = Object.values(details)
            .flat()                    
            .join("\n");               

        throw new Error(allMessages);
    }
    throw new Error(errorData.error || "Server error occurred");
  }

  return response.json();
}

export async function handleDelete(tableName: TableName, id: string) {
    const { csrf_token } = await fetchCsrf()

    const response = await fetch(`${API_BASE}/delete/${tableName}/${id}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
        },
        credentials: "include",
    })

    return response.json()
}

export async function fetchStudent(id: string) {
    const { csrf_token } = await fetchCsrf()

    const response = await fetch(`${API_BASE}/view/students/${id}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
        },
        credentials: "include",
    })

    return response.json()
}

export async function uploadImage(image: File, student_id: string) {
    const { csrf_token } = await fetchCsrf()

    const formData = new FormData()
    formData.append("image", image) 
    formData.append("student", student_id)

    const response = await fetch(`${API_BASE}/api/files/upload`, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrf_token
        },
        body: formData,
        credentials: "include",
    })

    return response.json()
}
