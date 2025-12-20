import type { College } from "@/models/types/colleges"
import type { Program } from "@/models/types/programs"
import { api } from "./csrf"
import type { UserData } from "@/models/types/UserData";

type TableName = "students" | "programs" | "colleges" | "users"

function parseApiError(err: any) {
    let parsed: any = {};
    try {
        parsed = JSON.parse(err.message || "{}");
    } catch {
        return { error: "Network error", details: null };
    }

    let details = parsed.details;
    if (details && typeof details === "object") {
        details = Object.values(details)
            .flat()
            .join(", "); 
    }

    return {
        error: parsed.error || "Unknown error",
        details: details || null,
        status: parsed.status || null
    };
}

export async function fetchTableData(table: string,
                                                        page: number,
                                                        limit: number,
                                                        tag: string,
                                                        key: string,
                                                        sorts: { id: string; order: string }[],
                                                        filters: Record<string, string | number | undefined> = {}
                                                        ) {
 
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        tag: tag.toString(),
        key: key.toString(),
        sorts: JSON.stringify(sorts), 
        filters: JSON.stringify(filters), 
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
        const res =  await api.post(`/api/create/${tableName}`, data);
        console.log(res)
        if ("error" in res) throw res;
        return res;
    } catch (err: any) {
        throw parseApiError(err);
    }
}

export async function handleUpdate<T>(tableName: TableName, updated: T, id: string | number) {
    try {
        const res = await api.put(`/api/edit/${tableName}/${id}`, updated);
        if ("error" in res) throw res;
        return res;
    } catch (err: any) {
        throw parseApiError(err);
    }

}

export async function handleDelete(tableName: TableName, id: string | number) {
    try {
        const res = await api.delete(`/api/delete/${tableName}/${id}`);
        if ("error" in res) throw res;
        return res;
    } catch (err: any) {
        throw parseApiError(err);
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
        throw parseApiError(err);
    }

}

export async function deleteImage(object: TableName, id: string | number) {
    
    try {
        return await api.delete("/api/files/delete", {
            object,
            id: id.toString()
        });
    } catch (err: any) {
        throw parseApiError(err);
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
        throw parseApiError(err);
    }
}

export async function registerUser(data: UserData) {
    try {
        const res = await api.post("/api/auth/register", data)
        return res
    } catch (err: any) {
        throw parseApiError(err);
    }
}