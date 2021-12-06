const fs = require('fs');
const path = require('path');

class LanternFish {
    reset = 0
    timer = 0;

    constructor(timer = 8, reset = 6) {
        this.reset = reset;
        this.timer = timer;
    }

    tick() {
        if (this.timer < 1) {
            this.timer = this.reset;
            return new LanternFish();
        }

        this.timer--;
    }
}

const lanternFishes = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .flatMap(l => l.split(','))
    .map(intialTimer => new LanternFish(parseInt(intialTimer)));

for (let i = 1; i <= 80; i++) {
    lanternFishes.push(...lanternFishes
        .map(lf => lf.tick())
        .filter(lf => !!lf));
}

module.exports = {
    'Part #1': lanternFishes.length
}