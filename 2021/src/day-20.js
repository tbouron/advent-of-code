const fs = require('fs');
const path = require('path');

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8').trim();
const [algorithm, data] = initialInput.split('\n\n').map(v => v.trim());

function enhancedImageStep(image, defaultChar = '.') {
    const width = image[0].length + 2;
    image.forEach(line => {
        line.unshift(defaultChar);
        line.push(defaultChar);
    });
    image.unshift(Array(width).fill(defaultChar))
    image.push(Array(width).fill(defaultChar));

    return image.map((line, row, rows) => line.map((pixel, col, cols) => {
        let pixelSequence = [];
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r < 0 || r > rows.length - 1) {
                    pixelSequence.push(defaultChar)
                } else if (c < 0 || c > cols.length - 1) {
                    pixelSequence.push(defaultChar)
                } else {
                    pixelSequence.push(rows[r][c]);
                }
            }
        }
        const index = parseInt(pixelSequence.map(v => v === '#' ? 1 : 0).join(''), 2);
        return algorithm.at(index);
    }));
}

function enhanceImage(image, steps = 2) {
    Array(steps).fill(0).forEach((v, index) => {
        let defaultChar = '.';
        if (algorithm[0] === '#' && algorithm[algorithm.length - 1] === '.') {
            defaultChar = index % 2 === 0 ? '.' : '#';
        }
        image = enhancedImageStep(image, defaultChar);
    });

    return image;
}

function countLights(image) {
    return image
        .map(l => l.filter(p => p === '#').length)
        .reduce((sum, lineCount) => sum + lineCount, 0);
}

const initialImage = data.split('\n').map(line => line.split(''));

const output1 = enhanceImage(initialImage, 2);
const output2 = enhanceImage(output1, 48);

module.exports = {
    'Part #1': countLights(output1),
    'Part #2': countLights(output2)
};
