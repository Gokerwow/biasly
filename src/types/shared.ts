// Standard response shape for all server actions
export interface ActionResponse<T = null> {
    success: boolean
    data?: T
    error?: string | Error
}