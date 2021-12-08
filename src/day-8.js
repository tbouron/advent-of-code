const fs = require('fs');
const path = require('path');

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '');

const part1 = initialInput
    .flatMap(l => l.split('|')[1].trim().split(' '))
    .reduce((count, signal) => {
        if ([2, 3, 4, 7].includes(signal.length)) {
            count++;
        }
        return count;
    }, 0);

module.exports = {
    'Part #1': part1
}