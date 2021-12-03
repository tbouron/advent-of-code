const fs = require('fs');
const path = require('path');

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(line => line.trim() !== '')
    .reduce((acc, line) => {
        line.split('').forEach((bit, index) => {
            if (!Array.isArray(acc[index])) {
                acc[index] = [];
            }
            acc[index].push(parseInt(bit));
        })
        return acc;
    }, []);

const gammaRate = parsedInput.map(bits => {
    let maxCount = 0;

    return bits.reduce((acc, bit) => {
        acc[bit]++;
        return acc;
    }, [0, 0]).reduce((acc, count, bit) => {
        if (count > maxCount) {
            maxCount = count;
            return bit;
        }
        return acc;
    }, 0);
});
const epsilonRate = gammaRate.map(bit => bit ^ 1);

module.exports = {
    'Part #1': parseInt(gammaRate.join(''), 2) * parseInt(epsilonRate.join(''), 2)
};