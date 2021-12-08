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

const part2 = initialInput
    .map(l => {
        const parts = l.split('|').map(p => p.trim().split(' ').map(item => item.trim()));

        const mapping = getWireMapping(parts[0]);

        return parseInt(parts[1].reduce((sum, encodedSignal) => sum + decode(encodedSignal, mapping), ''));
    })
    .reduce((sum, n) => sum + n, 0);

module.exports = {
    'Part #1': part1,
    'Part #2': part2
}