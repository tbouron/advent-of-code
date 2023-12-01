import * as fs from "fs";
import * as path from "path";
import {dijkstra, multiply} from "../../util";

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim();
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim();

function parseGraph(raw: string) {
    let canMove = (start: string, end?: string) => {
        // If the start is "S" then we want to consider all possible node
        if (start.charCodeAt(0) <= 83) {
            return true;
        }
        // // If the end node is an uppercase letter, then we discard any except the goal, which is "E"
        if (end && end.charCodeAt(0) <= 90) {
            return start.charCodeAt(0) === 122;
        }
        // Otherwise, we move if end is != undefined and the diff between end vs start node is 0 or 1
        return start && end && end.charCodeAt(0) - start.charCodeAt(0) <= 1;
    }

    return raw.trim().split('\n')
        .reduce((graph, line, lineIndex, lines) => {
            line.split('').forEach((node, keyIndex) => {
                const nodeKey = ['S', 'E'].includes(node) ? node : `${node}-${lineIndex}-${keyIndex}`;
                if (!graph.hasOwnProperty(nodeKey)) {
                    graph[nodeKey] = {};
                }
                [
                    // UP
                    {
                        row: lineIndex - 1,
                        col: keyIndex
                    },
                    // LEFT
                    {
                        row: lineIndex,
                        col: keyIndex - 1
                    },
                    // DOWN
                    {
                        row: lineIndex + 1,
                        col: keyIndex
                    },
                    // RIGHT
                    {
                        row: lineIndex,
                        col: keyIndex + 1
                    }
                ].filter(n => n.row >= 0 && n.col >= 0).forEach((n, neighbourIndex) => {
                    const neighbour = lines.at(n.row)?.at(n.col);
                    // @ts-ignore
                    const neighbourKey = ['S', 'E'].includes(neighbour) ? neighbour : `${neighbour}-${n.row}-${n.col}`;
                    if (canMove(node, neighbour)) {
                        // @ts-ignore
                        graph[nodeKey][neighbourKey] = neighbour.charCodeAt(0);
                    }
                });
            });
            return graph;
        }, {} as {[key: string]: {[key: string]: number}});
}

const graph = parseGraph(rawInput);
const shorterPath = dijkstra(graph, 'S', 'E');

export const Part1 = shorterPath.path.length - 1;
export const Part2 = shorterPath.path.filter(p => !p.startsWith('a')).length - 1;