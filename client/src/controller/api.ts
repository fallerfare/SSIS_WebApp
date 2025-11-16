import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export function useApi() {
    const axiosPrivate = useAxiosPrivate();

    // =============
    // AUTH
    // =============
    async function getSession() {
        const res = await axiosPrivate.get("/api/auth/me", {
            withCredentials: true,
        });
        return res.data;
    }

    // =============
    // TABLES
    // =============
    async function fetchTableData(
        table: string,
        page: number,
        limit: number,
        tag: string,
        key: string,
        sort: string,
        order: string
    ) {
        const res = await axiosPrivate.get(`/table/${table}`, {
            params: { page, limit, tag, key, sort, order },
        });

        return res.data;
    }

    async function getCollegeList() {
        const res = await axiosPrivate.get(`/table/colleges`);
        return res.data;
    }

    async function getProgramList(college_code: string) {
        const res = await axiosPrivate.get(`/table/programs`, {
            params: { tag: "college_code", key: college_code },
        });
        return res.data;
    }

    // =============
    // CRUD
    // =============
    async function handleInsert<T>(tableName: string, data: T) {
        const res = await axiosPrivate.post(`/create/${tableName}`, data);
        return res.data;
    }

    async function handleUpdate<T>(tableName: string, updated: T, id: string) {
        const res = await axiosPrivate.put(`/edit/${tableName}/${id}`, updated);
        return res.data;
    }

    async function handleDelete(tableName: string, id: string) {
        const res = await axiosPrivate.delete(`/delete/${tableName}/${id}`);
        return res.data;
    }

    return {
        getSession,
        fetchTableData,
        getCollegeList,
        getProgramList,
        handleInsert,
        handleUpdate,
        handleDelete,
    };
}
