const API_BASE = "http://localhost:8080"

export async function fetchTableData(table: string,
                                                        page: number,
                                                        limit: number
                                                        ) {
                                                            
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await fetch(`${API_BASE}/${table}/list?${params}`)
    if (!response.ok) throw new Error("Failed to fetch data")
    return response.json()
    }
