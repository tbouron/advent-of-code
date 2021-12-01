import * as fs from 'fs';

const inputFile = 'input/day-1.txt';
const increaseCount = fs.readFileSync(inputFile, 'utf8')
    .split('\n')
    .map(item => parseInt(item))
    .reduce((acc, item, index, list) => {
        if (index > 0) {
            acc += item > list[index -1] ? 1 : 0;
        }
        return acc;
    }, 0);

console.log(`Based on the input file "${inputFile}", the depth increases "${increaseCount}" times`);