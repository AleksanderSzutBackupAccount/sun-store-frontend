export interface NormalizedError {
    statusCode: number
    message: string
}

export function formatError(error: unknown): NormalizedError {
    if (isH3Error(error)) {
        return {
            statusCode: error.statusCode ?? 500,
            message: error.statusMessage ?? 'Internal server error',
        }
    }

    if (error && typeof error === 'object' && 'statusMessage' in error) {
        const err = error as Record<string, unknown>
        return {
            statusCode: err.statusCode as number ?? 500,
            message: err.statusMessage as string ?? 'Request failed',
        }
    }

    if (error instanceof Error) {
        return {
            statusCode: 500,
            message: error.message,
        }
    }

    return {
        statusCode: 500,
        message: 'Unknown error',
    }
}

function isH3Error(error: unknown): error is { statusCode?: number, statusMessage?: string } {
    return Boolean(
        error &&
        typeof error === 'object' &&
        ('statusCode' in error || 'statusMessage' in error)
    )
}