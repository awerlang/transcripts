export function clamp(min: number, max: number, value: number) {
    return Math.min(max, Math.max(min, value))
}

export function compareFloat(a: number, b: number) {
    return Math.abs(a - b) <= Number.EPSILON
}
