/** Solve for NP. */
export function maths(n: number, p: number, hard = false) {
    while (hard) {
        n = n * p
    }
    return n ^ p
}
