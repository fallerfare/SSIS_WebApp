import type { College } from "@/models/types/colleges"
import type { Program } from "@/models/types/programs"
import { api } from "./csrf"
import type { UserData } from "@/models/types/UserData";

type TableName = "students" | "programs" | "colleges" | "users"

function parseApiError(errorData: any, status: number): string {
    if (typeof errorData === "string") return errorData;

    if (status === 400 && errorData.details && typeof errorData.details === "object") {
        const details = errorData.details as Record<string, string[]>;
        return Object.values(details).flat().join("\n");
    }

    if (status === 409 && errorData.details && typeof errorData.details === "string") {
        return errorData.details;
    }

    return errorData.error || "Server error occurred";
}

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

    return api.get(`/table/${table}?${params.toString()}`);
}

export async function getSession(): Promise<{ isLoggedIn: boolean; user_name? : string }> {
    try {
        const data = await api.get("/api/me");
        return { isLoggedIn: true, user_name: data.user_name };
    } catch {
        return { isLoggedIn: false };
    }
}

export async function getCollegeName(college_code: string) {
  return api.get(`/view/students/collegeName/${college_code}`, false);
}

export async function getProgramName(program_code: string) {
  return api.get(`/view/students/programName/${program_code}`, false);
}

export async function getCollegeList(): Promise<{ data: College[] }> {
  return api.get("/table/colleges", false);
}

export async function getProgramList(college_code: string): Promise<{ data: Program[] }> {
  const params = new URLSearchParams({ tag: "college_code", key: college_code });
  return api.get(`/table/programs?${params.toString()}`, false);
}

export async function handleInsert<T>(tableName: TableName, data: T) {
    try {
        return await api.post(`/create/${tableName}`, data);
    } catch (err: any) {
        const parsed = JSON.parse(err.message || "{}");
        throw new Error(parseApiError(parsed, parsed.status || 0));
    }
}

export async function handleUpdate<T>(tableName: TableName, updated: T, id: string | number) {
    try {
        return await api.put(`/edit/${tableName}/${id}`, updated);
    } catch (err: any) {
        const parsed = JSON.parse(err.message || "{}");
        throw new Error(parseApiError(parsed, parsed.status || 0));
    }
}

export async function handleDelete(tableName: TableName, id: string | number) {
    try {
        return await api.delete(`/delete/${tableName}/${id}`);
    } catch (err: any) {
        const parsed = JSON.parse(err.message || "{}");
        throw new Error(parseApiError(parsed, parsed.status || 0));
    }
}

export async function fetchObject(object: TableName, id: string | number) {
    return api.get(`/view/${object}/${id}`);
}

export async function uploadImage(object: TableName, image: File, id: string | number) {
    const formData = new FormData()
    formData.append("object", object)
    formData.append("image", image) 
    formData.append("id", id.toString())

    try {
        return await api.upload("/api/files/upload", formData);
    } catch (err: any) {
        const parsed = JSON.parse(err.message || "{}");
        throw new Error(parseApiError(parsed, parsed.status || 0));
    }
}

export async function fetchMe() {
    return api.get("/api/me");
}

export async function handleLogout() {
    return api.post("/logout", {});
}

export async function loginUser(data: UserData) {
    try {
        return await api.post("/login", data)
    } catch (err: any) {
        const parsed = JSON.parse(err.message || "{}")
        throw new Error(parseApiError(parsed, parsed.status || 0))
    }
}

export async function registerUser(data: UserData) {
    try {
        return await api.post("/register", data)
    } catch (err: any) {
        const parsed = JSON.parse(err.message || "{}")
        throw new Error(parseApiError(parsed, parsed.status || 0))
    }
}