const fs = require('fs');
const path = require('path');

const median = (list) => {
    let sortedList = Array.of(...list).sort((a, b) => a - b);
    const center = Math.floor(sortedList.length / 2);
    if (sortedList % 2 === 0) {
        return (sortedList[center - 1] + sortedList[center]) / 2
    }
    return sortedList[center];
}

const mean = (list) => {
    return Math.floor(list.reduce((sum, i) => sum + i, 0) / list.length);
}

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split(',')
    .filter(l => l.trim() !== '')
    .map(l => parseInt(l));
const mostEfficientPositionPart1 = median(initialInput);
const mostEfficientPositionPart2 = mean(initialInput);

module.exports = {
    'Part #1': initialInput.reduce((acc, i) => acc + Math.abs(i - mostEfficientPositionPart1), 0),
    'Part #2': initialInput.reduce((acc, i) => {
        let distance = Math.abs(i - mostEfficientPositionPart2);
        return acc + Array(distance).fill(1).reduce((sum, value, index) => sum + (value * (index + 1)), 0);
    }, 0)
};