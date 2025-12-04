import type { College } from "@/models/types/colleges"
import type { Program } from "@/models/types/programs"
import { api } from "./csrf"
import type { UserData } from "@/models/types/UserData";

type TableName = "students" | "programs" | "colleges" | "users"

function parseApiError(err: any) {
    try {
        return JSON.parse(err.message || "{}");
    } catch {
        return { success: false, message: "Network error" };
    }
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

    return api.get(`/api/table/${table}?${params.toString()}`);
}

export async function fetchMe() {
    return api.get("/api/auth/me");
}

export async function getCollegeName(college_code: string) {
  return api.get(`/api/view/students/collegeName/${college_code}`, false);
}

export async function getProgramName(program_code: string) {
  return api.get(`/api/view/students/programName/${program_code}`, false);
}

export async function getCollegeList(): Promise<{ data: College[] }> {
  return api.get("/api/table/colleges", false);
}

export async function getProgramList(college_code: string): Promise<{ data: Program[] }> {
  const params = new URLSearchParams({ tag: "college_code", key: college_code });
  return api.get(`/api/table/programs?${params.toString()}`, false);
}

export async function handleInsert<T>(tableName: TableName, data: T) {
    try {
        return await api.post(`/api/create/${tableName}`, data);
    } catch (err: any) {
        return parseApiError(err);
    }

}

export async function handleUpdate<T>(tableName: TableName, updated: T, id: string | number) {
    try {
        return await api.put(`/api/edit/${tableName}/${id}`, updated);
    } catch (err: any) {
        return parseApiError(err);
    }

}

export async function handleDelete(tableName: TableName, id: string | number) {
    try {
        const res = await api.delete(`/api/delete/${tableName}/${id}`);
        return res.data
    } catch (err: any) {
        return parseApiError(err);
    }
}

export async function fetchObject(object: TableName, id: string | number | undefined) {
    return api.get(`/api/view/${object}/${id}`);
}

export async function uploadImage(object: TableName, image: File, id: string | number) {
    const formData = new FormData()
    formData.append("object", object)
    formData.append("image", image) 
    formData.append("id", id.toString())

    try {
        return await api.upload("/api/files/upload", formData);
    } catch (err: any) {
        return parseApiError(err);
    }

}

export async function handleLogout() {
    return api.post("/api/auth/logout", {});
}

export async function loginUser(data: UserData) {
    try {
        const res =  await api.post("/api/auth/login", data)
        return res
    } catch (err: any) {
        return parseApiError(err);
    }
}

export async function registerUser(data: UserData) {
    try {
        const res = await api.post("/api/auth/register", data)
        return res
    } catch (err: any) {
        return parseApiError(err);
    }
}