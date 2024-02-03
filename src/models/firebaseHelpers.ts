export type FirebaseResponse = {
    success: boolean,
    error?: {
        message: string,
        code: number
    }
}