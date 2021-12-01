import * as fs from 'fs';

const inputFile = '../input/day-1.txt';
const parsedInput = fs.readFileSync(inputFile, 'utf8')
    .split('\n')
    .map(item => parseInt(item));

const calculateIncrease = list => list.reduce((acc, item, index, list) => {
    if (index > 0) {
        acc += item > list[index - 1] ? 1 : 0;
    }
    return acc;
}, 0);

const increaseCount = calculateIncrease(parsedInput);
const slidingWindowsCount = calculateIncrease(parsedInput
    .reduce((acc, item, index, list) => {
        if (index > 2) {
            acc.push(item + list[index - 1] + list[index - 2]);
        }
        return acc;
    }, []));

console.log(`Based on the input file "${inputFile}", the depth increases "${increaseCount}" times`);
console.log(`Based on the input file "${inputFile}", the sliding windows increase "${slidingWindowsCount}" times`);