export type FirebaseResponse = {
    success: boolean,
    data?: any
    error?: {
        message: string,
        code: number
    }
}