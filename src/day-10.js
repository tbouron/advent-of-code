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
        corruptedPoints: 3,
        incompletePoints: 1
    },
    {
        start: '[',
        end: ']',
        corruptedPoints: 57,
        incompletePoints: 2
    },
    {
        start: '{',
        end: '}',
        corruptedPoints: 1197,
        incompletePoints: 3
    },
    {
        start: '<',
        end: '>',
        corruptedPoints: 25137,
        incompletePoints: 4
    }
];

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => parse(l.split(''), pairs));

const corruptedLines = initialInput
    .filter(result => typeof result === 'string');

const incompleteLines = initialInput
    .filter(result => Array.isArray(result))
    .map(result => result
        .reverse()
        .map(t => pairs.find(p => p.start === t).end));

const incompleteScores = incompleteLines
    .map(missingTokens => missingTokens
        .reduce((sum, missingToken) => {
            return sum * 5 + pairs.find(p => p.end === missingToken).incompletePoints;
        }, 0))
    .sort((a, b) => b - a);

module.exports = {
    'Part #1': corruptedLines.reduce((sum, invalidToken) => sum + pairs.find(p => p.end === invalidToken).corruptedPoints, 0),
    'Part #2': incompleteScores[Math.floor(incompleteScores.length / 2)]
};