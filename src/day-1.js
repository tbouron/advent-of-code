const fs = require('fs');
const path = require('path');

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .map(item => parseInt(item))
    .filter(item => !isNaN(item));

const calculateIncrease = list => list.reduce((acc, item, index, list) => {
    if (index > 0) {
        acc += item > list[index - 1] ? 1 : 0;
    }
    return acc;
}, 0);

module.exports = {
    'Part #1': calculateIncrease(parsedInput),
    'Part #2': calculateIncrease(parsedInput.reduce((acc, item, index, list) => {
        if (index > 2) {
            acc.push(item + list[index - 1] + list[index - 2]);
        }
        return acc;
    }, []))
};
