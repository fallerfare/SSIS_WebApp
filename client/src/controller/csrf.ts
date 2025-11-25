async function getCsrfToken() {
    const res = await fetch(`/api/csrf-token`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch CSRF Token");
    return (await res.json()).csrf_token;
}

async function apiFetch(
    url: string,
    options: RequestInit = {},
    needsCsrf: boolean = true
) {
    const headers: Record<string, any> = {
        ...(options.headers || {}),
    };

    if (needsCsrf) {
        const csrf = await getCsrfToken();
        headers["X-CSRFToken"] = csrf;
    }

    const response = await fetch(`${url}`, {
        ...options,
        headers,
        credentials: "include",
    });

    let data: any;
    try {
        data = await response.json();
    } catch {
        data = await response.text(); 
    }

    if (!response.ok) {
        if (typeof data === "string") {
            throw new Error(JSON.stringify({ error: data, status: response.status }));
        }
        throw new Error(JSON.stringify({ ...data, status: response.status }));
    }

    return data;

}

export const api = {
    get: (url: string, csrf = false) =>
        apiFetch(url, { method: "GET" }, csrf),

    post: (url: string, body: any, csrf = true) =>
        apiFetch(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            },
            csrf
        ),

    put: (url: string, body: any, csrf = true) =>
        apiFetch(
            url,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            },
            csrf
        ),

    delete: (url: string, csrf = true) =>
        apiFetch(url, { method: "DELETE" }, csrf),

    upload: async (url: string, formData: FormData) =>
        apiFetch(
            url,
            {
                method: "POST",
                body: formData,
            },
            true
        ),
};


