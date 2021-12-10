const fs = require('fs');
const path = require('path');

class ParsingError extends Error {
    constructor(expected, found) {
        super();
        this.expected = expected;
        this.found = found;
    }
}

function parse(tokens = [], pairs) {
    try {
        return tokens.reduce((rest, token, index, input) => {
            if (pairs.map(p => p.start).includes(token)) {
                rest.push(token);
            } else if (pairs.map(p => p.end).includes(token)) {
                const openToken = rest[rest.length - 1];
                if (index === 0 || token !== pairs.find(p => p.start === openToken).end) {
                    throw new ParsingError(openToken, token);
                }
                rest.pop();
            }
            return rest;
        }, []);
    } catch (ex) {
        return ex.found;
    }
}

const pairs = [
    {
        start: '(',
        end: ')',
        points: 3,
    },
    {
        start: '[',
        end: ']',
        points: 57,
    },
    {
        start: '{',
        end: '}',
        points: 1197,
    },
    {
        start: '<',
        end: '>',
        points: 25137,
    }
];

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => parse(l.split(''), pairs));

const corruptedLines = initialInput
    .filter(result => typeof result === 'string');

module.exports = {
    'Part #1': corruptedLines.reduce((sum, invalidToken) => sum + pairs.find(p => p.end === invalidToken).points, 0)
};