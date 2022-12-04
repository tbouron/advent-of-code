export function sum(arr: Array<number>) {
    return arr.reduce((sum, priorities) => sum + priorities, 0);
}

export function expandRange(lowBound: number, highBound: number): number[] {
    let diff = highBound - lowBound;
    return diff > 0 ? Array(diff + 1).fill(lowBound).map((value, index) => value + index) : [lowBound];
}

export function intersection(...args: any[][]) {
    Array.from(args).forEach((arg, index) => {
        if (!Array.isArray(arg)) {
            throw new Error(`Argument #${index + 1} must be an array. Got: ${arg}`);
        }
    });

    const smallerSet = new Set(Array.from(args).reduce((s: any[] | null, arg: any[]) => {
        if (s === null) {
            return arg;
        }
        if (arg.length < s.length) {
            return arg;
        }
        return s;
    }, null));
    const sets = Array.from(args)
        .map(other => new Set(other))
        .filter(arg => arg !== smallerSet);
    return Array.from(smallerSet).filter(item => sets.every(set => set.has(item)));
}
