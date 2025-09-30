import type { UserData } from "../models/types/UserData";

const API_BASE = "http://localhost:8080"

export async function fetchCsrf(): Promise<{ csrf_token: string }> {
                                                        
    const response = await fetch(`${API_BASE}/api/csrf-token`, 
        {credentials: "include", })

    if (!response.ok) throw new Error("Failed to fetch CSRF Token")
   
    return response.json()
    }

export async function sendCsrf( form: UserData,
                                                csrf_token: string,
                                                type: string
): 
                                                
                                Promise<any> {
                                                        
    const response = await fetch(`${API_BASE}/${type}`, 
        {method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf_token,
        },
        credentials: "include", 
        body: JSON.stringify(form)})

    const data = await response.json()

    if (!response.ok) {
        throw new Error(JSON.stringify(data.errors || "Server error occured"))
    }

    return data
}
