const fs = require('fs');
const path = require('path');

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => l.split('-'));

function numPaths(path, links, maxNumberVisitsForSmallACave = 1) {
    const lastNode = path[path.length - 1];

    if (lastNode === 'end') {
        return 1;
    }

    const hasReachedMaxNumberForASmallCave = Object.values(path.filter(n => n.match(/[a-z]+/)).reduce((map, node) => {
        if (!map.hasOwnProperty(node)) {
            map[node] = 0;
        }
        map[node]++;
        return map;
    }, {})).some(v => v >= maxNumberVisitsForSmallACave);

    const total = links
        .filter(link => link.includes(lastNode))
        .reduce((sum, link) => {
            const nextNode = link.find(linkNode => linkNode !== lastNode
                && linkNode !== 'start'
                && (
                    linkNode.match(/[A-Z]+/)
                    || path.filter(pathNode => pathNode === linkNode).length < (hasReachedMaxNumberForASmallCave ? 1 : maxNumberVisitsForSmallACave)
                ));
            if (nextNode) {
                sum += numPaths(path.concat([nextNode]), links, maxNumberVisitsForSmallACave);
            }
            return sum;
        }, 0);

    return total;
}

module.exports = {
    'Part #1': numPaths(['start'], initialInput),
    'Part #2': numPaths(['start'], initialInput, 2)
};