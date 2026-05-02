/* eslint-disable @typescript-eslint/no-explicit-any */
export function handleQueryError(error: any, context: string): never {
    console.error(`Error at ${context}:`, error);
    throw new Error(`Error at ${context}: ${error.message || error}`);
}

export function handleUploadImageError(error: any, context: string): never {
    console.error(`Error at ${context}:`, error);
    throw new Error(`Error at ${context}: ${error.message || error}`);
}