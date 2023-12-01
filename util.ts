export function sum(arr: number[]) {
    return arr.reduce((sum, value) => sum + value, 0);
}

export function multiply(arr: number[]) {
    return arr.reduce((acc, value) => acc * value, 1);
}

export function hasDuplicateValues(arr: string[]) {
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

export function intersection<T>(...args: T[][]) {
    Array.from(args).forEach((arg, index) => {
        if (!Array.isArray(arg)) {
            throw new Error(`Argument #${index + 1} must be an array. Got: ${arg}`);
        }
    });

    const smallerSet = new Set(Array.from(args).reduce((s: T[] | null, arg: T[]) => {
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

export enum Direction {
    TOP,
    LEFT,
    BOTTOM,
    RIGHT
}

export class Matrix<T> {

    private readonly matrix: T[][];

    constructor(input: T[][]) {
        if (!input.every(line => line.length === input[0].length)) {
            throw new Error('The input matrix must have the same length for every row');
        }
        this.matrix = input;
    }

    get() {
        return this.matrix;
    }

    transpose() {
        return this.matrix[0].map((_, c) => this.matrix.map(r => r[c]));
    }

    getItemsFrom(row: number, col: number, direction: Direction) {
        if (row < 0 || row >= this.matrix.length) {
            throw new Error(`Starting position row "${row}" is out of bound [0, ${this.matrix.length - 1}]`);
        }
        if (col < 0 || col >= this.matrix[row].length) {
            throw new Error(`Starting position col "${col}" is out of bound [0, ${this.matrix[row].length - 1}]`);
        }

        switch (direction) {
            case Direction.TOP:
                return Array(row).fill(0).map((v, index) => this.matrix[index][col]).reverse();
            case Direction.LEFT:
                return this.matrix[row].slice(0, col).reverse();
            case Direction.BOTTOM:
                return Array(this.matrix.length - 1 - row).fill(0).map((v, index) => this.matrix[row + 1 + index][col]);
            case Direction.RIGHT:
                return this.matrix[row].slice(col + 1);
        }
    }
}

export function transpose<T>(matrix: T[][]) {
    return new Matrix(matrix).transpose();
}

export function dijkstra<T>(graph: {[key: string]: {[key: string]: number}}, startNode: string, endNode: string) {
    let shortestDistanceNode = (distances: {[key: string]: number}, visited: string[]) => {
        return Object.entries(distances).reduce((shortestNode: string | null, entry) => {
            let foundShortest = shortestNode === null || distances[entry[0]] < distances[shortestNode];
            if (foundShortest && !visited.includes(entry[0])) {
                shortestNode = entry[0];
            }
            return shortestNode;
        }, null);
    };

    let distances: {[key: string]: number} = {};
    distances[endNode] = Number.MAX_VALUE;
    distances = Object.assign(distances, graph[startNode]);
    let parents: {[key: string]: string} = {};
    for (let child in graph[startNode]) {
        parents[child] = startNode;
    }

    let visited: string[] = [];
    let node = shortestDistanceNode(distances, visited);

    while (node) {
        let distance = distances[node];
        let children = graph[node];

        for (let child in children) {
            if (child === startNode) {
                continue;
            } else {
                let totalDistanceToChild = distance + children[child];
                if (!distances[child] || distances[child] > totalDistanceToChild) {
                    distances[child] = totalDistanceToChild;
                    parents[child] = node;
                }
            }
        }
        visited.push(node);
        node = shortestDistanceNode(distances, visited);
    }

    let shortestPath = [];
    let parent = parents[endNode];
    if (parent) {
        shortestPath.push(endNode);
    }
    while (parent) {
        shortestPath.push(parent);
        parent = parents[parent];
    }
    shortestPath.reverse();

    return {
        distance: distances[endNode],
        path: shortestPath,
    };
}

