import * as fs from "fs";
import * as path from "path";
import {sum} from "../../util";
import {isNumber} from "util";

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n');

const cache: {[key: string]: number} = {};

function walkTree(input: string[], hash: {[key: string]: Array<number | string>} = {}, currentPath: string[] = []): {[key: string]: Array<number | string>} {
    if (!input || input.length === 0) {
        return hash;
    }

    let line = input.shift()?.trim();
    if (line?.startsWith('$')) {
        // Command
        let changeFolderMatches = line && line.trim().match(/\$ cd (.*)/);
        if (Array.isArray(changeFolderMatches)) {
            if (changeFolderMatches[1] === '..') {
                currentPath.pop();
            } else {
                currentPath.push(changeFolderMatches[1]);
            }
        }
        if (!hash.hasOwnProperty(currentPath.join('/'))) {
            hash[currentPath.join('/')] = [];
        }
    } else {
        // Output
        let newFolderMatches = line && line.trim().match(/^dir (\w+)$/);
        let newFileMatches = line && line.trim().match(/^(\d+) (.*)$/);
        if (Array.isArray(newFolderMatches)) {
            hash[currentPath.join('/')].push([...currentPath, newFolderMatches[1]].join('/'));
        }
        if (Array.isArray(newFileMatches)) {
            hash[currentPath.join('/')].push(parseInt(newFileMatches[1]));
        }
    }

    return walkTree(input, hash, currentPath);
}

function calcSize(hash: {[key: string]: Array<number | string>}, folder: string): number {
    if (cache.hasOwnProperty(folder)) {
        return cache[folder];
    }
    if (!hash.hasOwnProperty(folder)) {
        return 0;
    }
    if (hash[folder].every(value => typeof value === 'number')) {
        cache[folder] = sum(hash[folder] as number[]);
        return cache[folder];
    }
    let number = sum(hash[folder].map(value => !(typeof value === 'number') ? calcSize(hash, value) : value));
    cache[folder] = number;
    return number

}

const tree = walkTree(rawInput);
const sizes = Object.entries(tree).map(entry => calcSize(tree, entry[0]));

const maxFsSpace = 70000000;
const updateSize = 30000000;
const usedSpace = calcSize(tree, '/');
const unusedSpace = maxFsSpace - usedSpace;
const spaceToRemove = updateSize - unusedSpace;

let sortedSizes = sizes.sort((a, b) => a - b);
let folderSizeToRemove
for (const index in sortedSizes) {
    if (sortedSizes[index] >= spaceToRemove) {
        folderSizeToRemove = sortedSizes[index];
        break;
    }
}

export const Part1 = sum(sizes.filter(size => size <= 100000));
export const Part2 = folderSizeToRemove;