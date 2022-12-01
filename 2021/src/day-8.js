const fs = require('fs');
const path = require('path');

function getWireMapping(encodedSignals = []) {
    const encodedSignalsGrouped = encodedSignals.reduce((display, signal) => {
        const wires = signal.trim().split('');
        switch (signal.length) {
            case 2:
                wires.forEach(w => display['1'].add(w));
                break;
            case 3:
                wires.forEach(w => display['7'].add(w));
                break;
            case 4:
                wires.forEach(w => display['4'].add(w));
                break;
            case 5:
                wires.forEach(w => {
                    display['2'].add(w);
                    display['3'].add(w);
                    display['5'].add(w);
                });
                break;
            case 6:
                wires.forEach(w => {
                    display['0'].add(w);
                    display['6'].add(w);
                    display['9'].add(w);
                });
                break;
            case 7:
                wires.forEach(w => display['8'].add(w));
                break;
        }
        return display;
    }, {0: new Set(), 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set(), 6: new Set(), 7: new Set(), 8: new Set(), 9: new Set()});

    const possibleMappings = Array(7).fill([]);

    possibleMappings[0] = Array.from(encodedSignalsGrouped['7']).filter(w => !encodedSignalsGrouped['1'].has(w));
    possibleMappings[1] = Array.from(encodedSignalsGrouped['4']).filter(w => !encodedSignalsGrouped['7'].has(w));
    possibleMappings[2] = Array.from(encodedSignalsGrouped['7']).filter(w => encodedSignalsGrouped['1'].has(w));
    possibleMappings[3] = Array.from(encodedSignalsGrouped['4']).filter(w => !encodedSignalsGrouped['7'].has(w));
    possibleMappings[4] = Array.from(encodedSignalsGrouped['8']).filter(w => !encodedSignalsGrouped['1'].has(w) && !encodedSignalsGrouped['4'].has(w) && !encodedSignalsGrouped['7'].has(w));
    possibleMappings[5] = Array.from(encodedSignalsGrouped['7']).filter(w => encodedSignalsGrouped['1'].has(w));
    possibleMappings[6] = Array.from(encodedSignalsGrouped['8']).filter(w => !encodedSignalsGrouped['1'].has(w) && !encodedSignalsGrouped['4'].has(w) && !encodedSignalsGrouped['7'].has(w));

    let mapping;
    for (let possibleMapping of permutationsFromPossibleMappings(possibleMappings)) {
        let strings = encodedSignals.map(s => decode(s, possibleMapping));
        if (strings.every(s => s !== undefined)) {
            mapping = possibleMapping;
            break;
        }
    }

    if (!mapping) {
        throw new Error(`Fail to find a mapping for encoded signals: ${encodedSignals}`);
    }

    return mapping;
}

function permutationsFromPossibleMappings(list, n = 0, result = [], current = []){
    if (n === list.length) {
        result.push(current);
    } else {
        list[n].forEach(item => permutationsFromPossibleMappings(list, n + 1, result, [...current, item]));
    }
    return result;
}

function decode(encodedSignal, wireMapping) {
    const decodedSignal = encodedSignal.split('').map(w => {
        switch (wireMapping.indexOf(w)) {
            case 0:
                return 'a';
            case 1:
                return 'b';
            case 2:
                return 'c';
            case 3:
                return 'd';
            case 4:
                return 'e';
            case 5:
                return 'f';
            case 6:
                return 'g';
            default:
                return '';
        }
    }).sort().join('');

    switch (decodedSignal) {
        case 'abcefg':
            return '0';
        case 'cf':
            return '1';
        case 'acdeg':
            return '2';
        case 'acdfg':
            return '3';
        case 'bcdf':
            return '4';
        case 'abdfg':
            return '5';
        case 'abdefg':
            return '6';
        case 'acf':
            return '7';
        case 'abcdefg':
            return '8';
        case 'abcdfg':
            return '9';
    }
}

function betterDecode(encodedSignal, encodedSignalFor1, encodedSignalFor4) {
    // This mapping allows to deduce the 7 segment digit from:
    // 1. the number of segments the encoded signal turns on
    // 2. the number of segments in common with the encoded signal for the digit "1"
    // 3. the number of segments in common with the encoded signal for the digit "4"
    // It is easy to identify the digit "1" and "4" as the have respectively 2 and 4 segments turned on.
    // All these combinations are unique hence why this is possible to decode that easily!
    const mapping = {
        '0': [6, 2, 3], // => 0
        '1': [2, 2, 2], // => 1
        '2': [5, 1, 2], // => 2
        '3': [5, 2, 3], // => 3
        '4': [4, 2, 4], // => 4
        '5': [5, 1, 3], // => 5
        '6': [6, 1, 3], // => 6
        '7': [3, 2, 2], // => 7
        '8': [7, 2, 4], // => 8
        '9': [6, 2, 4]  // => 9
    };

    let find = Object.entries(mapping).find(([digit, match]) => encodedSignal.length === match[0]
        && encodedSignal.split('').filter(segment => encodedSignalFor1.includes(segment)).length === match[1]
        && encodedSignal.split('').filter(segment => encodedSignalFor4.includes(segment)).length === match[2]);

    if (!find) {
        throw new Error(`Fail to decode signal "${encodedSignal}`);
    }

    return find[0];
}

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

// This is a *VERY* inefficient way to find the answer. Deduce digit 1, 4, 7 an 8 but then brute-force every possible
// pattern until we find the right one. Ugly, but it works!
// const part2 = initialInput
//     .map(l => {
//         const parts = l.split('|').map(p => p.trim().split(' ').map(item => item.trim()));
//
//         const mapping = getWireMapping(parts[0]);
//
//         return parseInt(parts[1].reduce((sum, encodedSignal) => sum + decode(encodedSignal, mapping), ''));
//     })
//     .reduce((sum, n) => sum + n, 0);

// This new implementation is so much more elegant but *NOT MINE*. Comes from the subreddit
// https://www.reddit.com/r/adventofcode/comments/rbj87a/comment/hnpgp65/?utm_source=reddit&utm_medium=web2x&context=3
// and is incredibly clever. See comment within the function "betterDecode"
const part2 = initialInput.map(l => {
    const encodedSignals = l.split(/\s+(|\s+)/);
    const encodedSignalsToDecode = l.split('|')[1].trim().split(/\s+/);
    const encodedSignalFor1 = encodedSignals.find(es => es.length === 2);
    const encodedSignalFor4 = encodedSignals.find(es => es.length === 4);

    return parseInt(encodedSignalsToDecode.reduce((number, es) => number + betterDecode(es, encodedSignalFor1, encodedSignalFor4), ''));
}).reduce((sum, number) => sum + number, 0);

module.exports = {
    'Part #1': part1,
    'Part #2': part2
}