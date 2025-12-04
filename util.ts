import * as path from 'path';
import {it} from "node:test";

const debug = require('debug')(path.basename(__filename));

export function sum(arr: number[]) {
    return arr.reduce((sum, value) => sum + value, 0);
}

export function multiply(arr: number[]) {
    return arr.reduce((acc, value) => acc * value, 1);
}

export function lcm(range: number[]) {
    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
    const _lcm = (x: number, y: number): number => (x * y) / gcd(x, y);
    return range.reduce((a, b) => _lcm(a, b));
}

export function hasDuplicateValues(arr: string[]) {
    return Object.values(arr.reduce((acc, value) => {
        if (!acc.hasOwnProperty(value)) {
            acc[value] = 0;
        }
        acc[value]++;
        return acc;
    }, {} as { [key: string]: number })).every(value => value === 1);
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

export function union<T>(...args: T[][]) {
    Array.from(args).forEach((arg, index) => {
        if (!Array.isArray(arg)) {
            throw new Error(`Argument #${index + 1} must be an array. Got: ${arg}`);
        }
    });

    return Array.from(Array.from(args).reduce((acc, a) => {
        a.forEach(v => acc.add(v));
        return acc;
    }, new Set()));
}

export enum Direction {
    TOP = 'TOP',
    TOP_LEFT = 'TOP_LEFT',
    TOP_RIGHT = 'TOP_RIGHT',
    LEFT = 'LEFT',
    BOTTOM = 'BOTTOM',
    BOTTOM_LEFT = 'BOTTOM_LEFT',
    BOTTOM_RIGHT = 'BOTTOM_RIGHT',
    RIGHT = 'RIGHT'
}

export const ALL_DIRECTIONS = [
    Direction.TOP,
    Direction.TOP_LEFT,
    Direction.LEFT,
    Direction.BOTTOM_LEFT,
    Direction.BOTTOM,
    Direction.BOTTOM_RIGHT,
    Direction.RIGHT,
    Direction.TOP_RIGHT
];

export const NSWE = [
    Direction.TOP,
    Direction.LEFT,
    Direction.BOTTOM,
    Direction.RIGHT,
];

export type Position = { row: number, col: number }

export class Matrix<T> {

    private readonly matrix: T[][];

    constructor(input: T[][]) {
        if (!input.every(line => line.length === input[0].length)) {
            throw new Error('The input matrix must have the same length for every row');
        }
        this.matrix = structuredClone(input);
    }

    get() {
        return this.matrix;
    }

    transpose() {
        return this.matrix[0].map((_, c) => this.matrix.map(r => r[c]));
    }

    getItemFor(position: Position) {
        this.validate(position);

        return this.matrix[position.row][position.col];
    }

    setItemFor(position: Position, item: T) {
        this.validate(position);

        this.matrix[position.row][position.col] = item;
    }

    getAdjacentItemsOf(position: Position, directions: Direction[]) {
        return directions.map(direction => {
            let nextPosition: Position;
            switch (direction) {
                case Direction.TOP:
                    nextPosition = {row: position.row - 1, col: position.col};
                    break;
                case Direction.TOP_RIGHT:
                    nextPosition = {row: position.row - 1, col: position.col + 1};
                    break;
                case Direction.RIGHT:
                    nextPosition = {row: position.row, col: position.col + 1};
                    break;
                case Direction.BOTTOM_RIGHT:
                    nextPosition = {row: position.row + 1, col: position.col + 1};
                    break;
                case Direction.BOTTOM:
                    nextPosition = {row: position.row + 1, col: position.col};
                    break;
                case Direction.BOTTOM_LEFT:
                    nextPosition = {row: position.row + 1, col: position.col - 1};
                    break;
                case Direction.LEFT:
                    nextPosition = {row: position.row, col: position.col - 1};
                    break;
                case Direction.TOP_LEFT:
                    nextPosition = {row: position.row - 1, col: position.col - 1};
                    break;
            }

            try {
                const valueFor = this.getItemFor(nextPosition);
                return {
                    position: nextPosition,
                    value: valueFor
                };
            } catch (e) {
                return null;
            }
        }).filter(item => item !== null) as {position: Position, value: T}[];
    }

    getItemsFrom(position: Position, direction: Direction) {
        this.validate(position);

        switch (direction) {
            case Direction.TOP:
                return Array(position.row + 1).fill(position.row)
                    .map((v, index) => v - index > -1 ? this.matrix[v - index][position.col] : null)
                    .filter(v => v !== null);
            case Direction.TOP_LEFT:
                return Array(position.row + 1).fill(position.row)
                    .map((v, index) => {
                        const ret = position.col > -1 || v - index > -1 ? this.matrix[v - index][position.col] : null;
                        position.col--;
                        return ret;
                    }).filter(v => v !== null);
            case Direction.TOP_RIGHT:
                return Array(position.row + 1).fill(position.row)
                    .map((v, index) => {
                        const ret = position.col < this.matrix[v - index].length || v - index > -1 ? this.matrix[v - index][position.col] : null;
                        position.col++;
                        return ret;
                    }).filter(v => v !== null);
            case Direction.LEFT:
                return this.matrix[position.row].slice(0, position.col + 1).reverse();
            case Direction.BOTTOM:
                return Array(this.matrix.length - position.row).fill(position.row)
                    .map((v, index) => this.matrix[v + index][position.col]);
            case Direction.BOTTOM_LEFT:
                return Array(this.matrix.length - position.row).fill(position.row)
                    .map((v, index) => {
                        const ret = position.col > -1 || v + index >= this.matrix.length ? this.matrix[v + index][position.col] : null;
                        position.col--;
                        return ret;
                    }).filter(v => v !== null);
            case Direction.BOTTOM_RIGHT:
                return Array(this.matrix.length - position.row).fill(position.row)
                    .map((v, index) => {
                        const ret = position.col < this.matrix[v + index].length || v + index >= this.matrix.length ? this.matrix[v + index][position.col] : null;
                        position.col++;
                        return ret;
                    }).filter(v => v !== null);
            case Direction.RIGHT:
                return this.matrix[position.row].slice(position.col);
        }
    }

    searchFirstItem(items: string[]) {
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                const itemFor = this.getItemFor({row, col});
                if (items.some(i => i === itemFor)) {
                    return {
                        row,
                        col,
                        item: itemFor
                    }
                }
            }
        }
    }

    search(pattern: string) {
        const map: {[key: string]: Position[]} = {};
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                const itemFor = this.getItemFor({row, col}) as string;
                if (itemFor.match(pattern)) {
                    if (!map.hasOwnProperty(itemFor)) {
                        map[itemFor] = [];
                    }
                    map[itemFor].push({row, col});
                }
            }
        }
        return map;
    }

    searchWord(search: string, directionsToSearch?: Direction[]) {
        if (search?.length === 0) {
            throw new Error('Search string must not be empty');
        }

        if (!directionsToSearch) {
            directionsToSearch = [
                Direction.TOP,
                Direction.TOP_LEFT,
                Direction.TOP_RIGHT,
                Direction.LEFT,
                Direction.RIGHT,
                Direction.BOTTOM,
                Direction.BOTTOM_LEFT,
                Direction.BOTTOM_RIGHT
            ];
        }

        const matches = [];
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                if (this.getItemFor({row, col}) !== search.charAt(0)) {
                    continue;
                }
                let possibleDirections = [];
                if (col + search.length <= this.matrix[row].length) {
                    possibleDirections.push(Direction.RIGHT);
                    if (row >= search.length - 1) {
                        possibleDirections.push(Direction.TOP_RIGHT);
                    }
                    if (row + search.length <= this.matrix.length) {
                        possibleDirections.push(Direction.BOTTOM_RIGHT);
                    }
                }
                if (col >= search.length - 1) {
                    possibleDirections.push(Direction.LEFT);
                    if (row >= search.length - 1) {
                        possibleDirections.push(Direction.TOP_LEFT);
                    }
                    if (row + search.length <= this.matrix.length) {
                        possibleDirections.push(Direction.BOTTOM_LEFT);
                    }
                }
                if (row + search.length <= this.matrix.length) {
                    possibleDirections.push(Direction.BOTTOM);
                }
                if (row >= search.length - 1) {
                    possibleDirections.push(Direction.TOP);
                }

                matches.push(...possibleDirections
                    .filter(possibleDirection => directionsToSearch?.includes(possibleDirection))
                    .map(direction => {
                        const items = this.getItemsFrom({row, col}, direction)
                        if (items.join('').startsWith(search)) {
                            debug(`Found candidate at row ${row} | col ${col} | direction ${direction} => ${items.join('')}`);
                            return items;
                        }
                        return null;
                    })
                    .filter(items => items !== null));
            }
        }

        return matches;
    }

    validate(position: Position) {
        if (position.row < 0 || position.row >= this.matrix.length) {
            throw new Error(`Starting position row "${position.row}" is out of bound [0, ${this.matrix.length - 1}]`);
        }
        if (position.col < 0 || position.col >= this.matrix[position.row].length) {
            throw new Error(`Starting position position.col "${position.col}" is out of bound [0, ${this.matrix[position.row].length - 1}]`);
        }
    }
}

export function transpose<T>(matrix: T[][]) {
    return new Matrix(matrix).transpose();
}

export function dijkstra<T>(graph: { [key: string]: { [key: string]: number } }, startNode: string, endNode: string) {
    let shortestDistanceNode = (distances: { [key: string]: number }, visited: string[]) => {
        return Object.entries(distances).reduce((shortestNode: string | null, entry) => {
            let foundShortest = shortestNode === null || distances[entry[0]] < distances[shortestNode];
            if (foundShortest && !visited.includes(entry[0])) {
                shortestNode = entry[0];
            }
            return shortestNode;
        }, null);
    };

    let distances: { [key: string]: number } = {};
    distances[endNode] = Number.MAX_VALUE;
    distances = Object.assign(distances, graph[startNode]);
    let parents: { [key: string]: string } = {};
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

