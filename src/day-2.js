const fs = require('fs');
const path = require('path');
const debug = require('debug')(path.basename(__filename));

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .map(line => {
        const parsedLine = line.split(' ');
        return parsedLine.length === 2 ? {
            action: parsedLine[0].trim(),
            value: parseInt(parsedLine[1].trim())
        } : null;
    })
    .filter(item => !!item);

const part1 = parsedInput.reduce((acc, item) => {
    switch (item.action) {
        case 'forward':
            acc.distance += item.value;
            break;
        case 'up':
            acc.depth -= item.value;
            break;
        case 'down':
            acc.depth += item.value;
            break;
        default:
            debug(`Unsupported action: "${item.action}" => Ignoring`);
            break;
    }
    return acc;
}, {
    depth: 0,
    distance: 0
});

const part2 = parsedInput.reduce((acc, item) => {
    switch (item.action) {
        case 'forward':
            acc.distance += item.value;
            acc.depth += item.value * acc.aim;
            break;
        case 'up':
            acc.aim -= item.value;
            break;
        case 'down':
            acc.aim += item.value;
            break;
        default:
            debug(`Unsupported action: "${item.action}" => Ignoring`);
            break;
    }
    return acc;
}, {
    depth: 0,
    distance: 0,
    aim: 0
});

module.exports = {
    'Part #1': part1.depth * part1.distance,
    'Part #2': part2.depth * part2.distance
};