const fs = require('fs');
const path = require('path');

function polymerFor(maxStep, initialPolymer, pairsMapping) {
    let currentPairs = {};
    for (let i = 0; i < initialPolymer.length - 1; i++) {
        const pair = initialPolymer.substr(i, 2);
        if (!currentPairs.hasOwnProperty(pair)) {
            currentPairs[pair] = 0;
        }
        currentPairs[pair]++;
    }
    let letterCounters = initialPolymer.split('').reduce((map, letter) => {
        if (!map.hasOwnProperty(letter)) {
            map[letter] = 0;
        }
        map[letter]++;
        return map;
    }, {});

    for (let step = 0; step < maxStep; step++) {
        currentPairs = growPolymer(pairsMapping, currentPairs, letterCounters);
    }
    return letterCounters;
}

function growPolymer(pairsMapping = {}, currentPairs = {}, letterCounters = {}) {
    return Object.entries(currentPairs).reduce((newPairs, [currentPair, currentCounter]) => {
        if (pairsMapping.hasOwnProperty(currentPair)) {
            const [left, right] = currentPair.split('');
            const middle = pairsMapping[currentPair];

            if (!letterCounters.hasOwnProperty(middle)) {
                letterCounters[middle] = 0;
            }
            letterCounters[middle] += currentCounter;

            if (!newPairs.hasOwnProperty(left + middle)) {
                newPairs[left + middle] = 0;
            }
            newPairs[left + middle] += currentCounter;
            if (!newPairs.hasOwnProperty(middle + right)) {
                newPairs[middle + right] = 0;
            }
            newPairs[middle + right] += currentCounter;
        } else {
            throw new Error(`Pair "${currentPair}" doesn't have a mapping!`);
        }
        return newPairs;
    }, {});
}

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n\n')
    .filter(l => l.trim() !== '');

const basePolymer = initialInput[0].trim();

const pairsMapping = initialInput[1]
    .trim()
    .split('\n')
    .reduce((map, l) => {
        const [key, value] = l.split('->').map(item => item.trim());
        if (!map.hasOwnProperty(key)) {
            map[key] = value;
        }
        return map;
    }, {});

const polymerLettersPart1 = Object.entries(polymerFor(10, basePolymer, pairsMapping)).sort((a, b) => b[1] - a[1]);
const polymerLettersPart2 = Object.entries(polymerFor(40, basePolymer, pairsMapping)).sort((a, b) => b[1] - a[1]);

module.exports = {
    'Part #1': polymerLettersPart1[0][1] - polymerLettersPart1.pop()[1],
    'Part #2': polymerLettersPart2[0][1] - polymerLettersPart2.pop()[1]
}