export type NvbResult<T> = {
    data: T;
    error: Error | undefined;
}