export function delayPromise(milliseconds: number): Promise<unknown> {
    return new Promise((r) => setTimeout(r, milliseconds));
}
