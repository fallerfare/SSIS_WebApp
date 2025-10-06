import type { College } from "@/models/types/colleges"
import type { Program } from "@/models/types/programs"
import { fetchCsrf } from "./fetchCsrf"

const API_BASE = "http://localhost:8080"

type TableName = "students" | "programs" | "colleges"

export async function fetchTableData(table: string,
                                                        page: number,
                                                        limit: number
                                                        ) {
                                                            
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
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
    console.log("Payload: ", data)
    console.log("function called handle")
    const { csrf_token } = await fetchCsrf()
    console.log("csrf fetched, validated")     

    const response = await fetch(`${API_BASE}/create/${tableName}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
        },
        credentials: "include",
        body: JSON.stringify(data),
    })

    console.log("backed shi happend")


    if (!response.ok) {
        throw new Error(`Failed to create ${tableName}: ${response.statusText}`)
    }

    return response.json()
    }