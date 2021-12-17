const fs = require('fs');
const path = require('path');

function simulate(xVelocity, yVelocity, target) {
    let success;
    let x = 0;
    let y = 0;
    let highestY = 0;

    const minTargetX = Math.min(target.start.x, target.end.x);
    const minTargetY = Math.min(target.start.y, target.end.y);
    const maxTargetX = Math.max(target.start.x, target.end.x);
    const maxTargetY = Math.max(target.start.y, target.end.y);

    while (success === undefined) {
        x += xVelocity;
        y += yVelocity;
        if (y > highestY) {
            highestY = y;
        }
        if (xVelocity > 0) {
            xVelocity--;
        }
        yVelocity--;

        // console.debug(`----> Simulate [${x}][${y}]`);

        if (minTargetX <= x && x <= maxTargetX && minTargetY <= y && maxTargetY >= y) {
            success = true;
        }

        if (x > maxTargetX || y < minTargetY) {
            success = false;
        }
    }

    // console.debug(`----> Simulation ${success ? 'successful' : 'failed'}`);

    return {
        success,
        x,
        y,
        highestY
    };
}

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .trim()
    .match(/target area: x=(([\-0-9]+)\.\.([\-0-9]+)), y=(([\-0-9]+)\.\.([\-0-9]+))/);

if (initialInput === null) {
    throw new Error('Failed to parse the initial input');
}

const target = {
    start: {
        x: parseInt(initialInput[2]),
        y: parseInt(initialInput[5])
    },
    end: {
        x: parseInt(initialInput[3]),
        y: parseInt(initialInput[6])
    }
}

let maxHeight = 0;
let bestXVelocity = 0;
let bestYVelocity = 0;
let xVelocity = 24;
let yVelocity = 80;

let count = 0;
while (count < 100) {
    // console.debug(`Tried [${xVelocity}][${yVelocity}]`);
    const {success, x, y, highestY} = simulate(xVelocity, yVelocity, target);
    if (success) {
        // console.debug(`===> Found better one [${xVelocity}][${yVelocity}] with highest Y of ${highestY}`);
        if (highestY > maxHeight) {
            maxHeight = highestY;
        }
        bestXVelocity = xVelocity;
        bestYVelocity = yVelocity;
        yVelocity++;
    }
    if (x > target.end.x) {
        xVelocity--;
    } else if (x < target.start.x) {
        xVelocity++;
    } else {
        xVelocity--;
        yVelocity++;
    }
    count++;
}

const max = 600;
const initialVelocities = [];
const arrayLoop = Array(max).fill(-1 * max / 2).map((v, i) => v + i)

arrayLoop.forEach(x => {
    arrayLoop.forEach(y => {
        const {success} = simulate(x, y, target);
        if (success) {
            // console.debug(`working initial velocities [${x}][${y}]`);
            initialVelocities.push({x, y});
        }
    });
})

module.exports = {
    'Part #1': maxHeight,
    'Part #2': initialVelocities.length
}