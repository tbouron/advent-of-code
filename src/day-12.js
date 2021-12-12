const fs = require('fs');
const path = require('path');

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => l.split('-'));

function numPaths(path, links) {
    const lastNode = path[path.length - 1];
    if (lastNode === 'end') {
        return 1;
    }

    const total = links
        .filter(link => link.includes(lastNode))
        .reduce((sum, link) => {
            const nextNode = link.find(n => n !== lastNode && n !== 'start' && (n.match(/[A-Z]+/) || !path.includes(n)));
            if (nextNode) {
                sum += numPaths(path.concat([nextNode]), links);
            }
            return sum;
        }, 0);

    return total;
}

module.exports = {
    'Part #1': numPaths(['start'], initialInput)
};