const fs = require('fs');
const path = require('path');

const mostCommonBit = bits => {
    let maxCount = 0;

    return bits.reduce((acc, bit) => {
        acc[bit]++;
        return acc;
    }, [0, 0]).reduce((acc, count, bit) => {
        if (count >= maxCount) {
            maxCount = count;
            return bit;
        }
        return acc;
    }, 0);
};

const baseInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(line => line.trim() !== '');

const gammaRate = baseInput
    .reduce((acc, line) => {
        line.split('').forEach((bit, index) => {
            if (!Array.isArray(acc[index])) {
                acc[index] = [];
            }
            acc[index].push(parseInt(bit));
        })
        return acc;
    }, [])
    .map(mostCommonBit);
const epsilonRate = gammaRate.map(bit => bit ^ 1);

const findRatingFor = (inputLines, flip = false, search = '', bitCriteriaIndex = 0) => {
    let bitCriteriaAtIndex = mostCommonBit(inputLines
        .map(inputLine => parseInt(inputLine.substr(bitCriteriaIndex, 1))));
    if (flip) {
        bitCriteriaAtIndex = bitCriteriaAtIndex ^ 1;
    }

    search += bitCriteriaAtIndex;

    const filteredLines = inputLines.filter(inputLine => inputLine.startsWith(search));

    if (filteredLines.length > 1) {
        return findRatingFor(filteredLines, flip, search, bitCriteriaIndex + 1);
    } else if (filteredLines.length === 1) {
        return filteredLines[0]
    } else {
        throw new Error('Hum, that is not supposed to happen!');
    }
}

const oxygenRate = findRatingFor(baseInput);
const co2ScrubberRate = findRatingFor(baseInput, true);

module.exports = {
    'Part #1': parseInt(gammaRate.join(''), 2) * parseInt(epsilonRate.join(''), 2),
    'Part #2': parseInt(oxygenRate, 2) * parseInt(co2ScrubberRate, 2)
};