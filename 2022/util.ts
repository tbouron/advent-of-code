export function sum(arr: number[]) {
    return arr.reduce((sum, priorities) => sum + priorities, 0);
}

export function hasDuplicateValues(arr: any[]) {
    return Object.values(arr.reduce((acc, value) => {
        if (!acc.hasOwnProperty(value)) {
            acc[value] = 0;
        }
        acc[value]++;
        return acc;
    }, {} as {[key: string]: number})).every(value => value === 1);
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

export function transpose(matrix: any[][]) {
    return matrix[0].map((_, c) => matrix.map(r => r[c]));
}
