import * as fs from 'fs';
import * as path from 'path';

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .split('\n')
    .reduce((acc: Array<number[]>, stringCalorie, index) => {
        if (index === 0 || stringCalorie.trim() === '') {
            acc.push([]);
        }
        const calorie = parseInt(stringCalorie);
        if (!isNaN(calorie)) {
            acc[acc.length - 1].push(parseInt(stringCalorie));
        }
        return acc;
    }, [])
    .map(caloriesPerElf => caloriesPerElf.reduce((total, calorie) => total + calorie, 0))
    .sort((a, b) => b - a)

export const Part1 = `The maximum calories carried by an elf is: ${parsedInput[0]}`;
export const Part2 = `The sum of the top three elves carrying the most Calories is: ${Array(3).fill(0).reduce((total, value, index) => total + parsedInput[index], 0)}`;
