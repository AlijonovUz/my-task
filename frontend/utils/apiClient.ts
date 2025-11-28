import { ENDPOINTS } from "./api"

export async function apiRegister(username: string, email: string, password: string) {
    try {
        const res = await fetch(ENDPOINTS.REGISTER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                email,
                password1: password,
                password2: password,
            }),
        })
        const data = await res.json()
        if (!res.ok) {
            let message = "Registration failed"
            if (data.error) {
                if (typeof data.error === "string") message = data.error
                else if (Array.isArray(data.error)) message = data.error.join(" ")
                else if (typeof data.error === "object") message = Object.values(data.error).flat().join(" ")
            }
            return { success: false, error: message }
        }
        return { success: true }
    } catch {
        return { success: false, error: "Server connection error" }
    }
}

export async function apiLogin(username: string, password: string) {
    try {
        const res = await fetch(ENDPOINTS.LOGIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
        const data = await res.json()
        if (!res.ok) {
            let message = "Login failed"
            if (data.error) {
                if (typeof data.error === "string") message = data.error
                else if (Array.isArray(data.error)) message = data.error.join(" ")
                else if (typeof data.error === "object") message = Object.values(data.error).flat().join(" ")
            }
            return { success: false, error: message }
        }
        return { success: true, token: data.token }
    } catch {
        return { success: false, error: "Server connection error" }
    }
}

export function getAuthHeaders(token?: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    const t = token ?? localStorage.getItem("accessToken")
    if (t) headers["Authorization"] = `Bearer ${t}`
    return headers
}

export async function apiGetTodos(token?: string) {
    try {
        const res = await fetch(ENDPOINTS.TODOS, { headers: getAuthHeaders(token) })
        const data = await res.json()
        if (!res.ok) {
            let message = "Failed to fetch todos"
            if (data.error) {
                if (typeof data.error === "string") message = data.error
                else if (Array.isArray(data.error)) message = data.error.join(" ")
                else if (typeof data.error === "object") message = Object.values(data.error).flat().join(" ")
            }
            return { success: false, error: message }
        }
        return { success: true, todos: data }
    } catch {
        return { success: false, error: "Server connection error" }
    }
}

export async function apiCreateTodo(title: string, token?: string) {
    try {
        const res = await fetch(ENDPOINTS.TODOS, {
            method: "POST",
            headers: getAuthHeaders(token),
            body: JSON.stringify({ title }),
        })
        const data = await res.json()
        if (!res.ok) {
            let message = "Failed to create todo"
            if (data.error) {
                if (typeof data.error === "string") message = data.error
                else if (Array.isArray(data.error)) message = data.error.join(" ")
                else if (typeof data.error === "object") message = Object.values(data.error).flat().join(" ")
            }
            return { success: false, error: message }
        }
        return { success: true, todo: data }
    } catch {
        return { success: false, error: "Server connection error" }
    }
}

export async function apiUpdateTodo(id: number, updatedFields: { title?: string; completed?: boolean }, token?: string) {
    try {
        const res = await fetch(`${ENDPOINTS.TODOS}${id}/`, {
            method: "PATCH",
            headers: getAuthHeaders(token),
            body: JSON.stringify(updatedFields),
        })
        const data = await res.json()
        if (!res.ok) {
            let message = "Failed to update todo"
            if (data.error) {
                if (typeof data.error === "string") message = data.error
                else if (Array.isArray(data.error)) message = data.error.join(" ")
                else if (typeof data.error === "object") message = Object.values(data.error).flat().join(" ")
            }
            return { success: false, error: message }
        }
        return { success: true, todo: data }
    } catch {
        return { success: false, error: "Server connection error" }
    }
}

export async function apiDeleteTodo(id: number, token?: string) {
    try {
        const res = await fetch(`${ENDPOINTS.TODOS}${id}/`, {
            method: "DELETE",
            headers: getAuthHeaders(token),
        })
        if (!res.ok) {
            const data = await res.json()
            let message = "Failed to delete todo"
            if (data.error) {
                if (typeof data.error === "string") message = data.error
                else if (Array.isArray(data.error)) message = data.error.join(" ")
                else if (typeof data.error === "object") message = Object.values(data.error).flat().join(" ")
            }
            return { success: false, error: message }
        }
        return { success: true }
    } catch {
        return { success: false, error: "Server connection error" }
    }
}