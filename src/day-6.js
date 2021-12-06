const fs = require('fs');
const path = require('path');

class LanternFishPool {

    pool = {};

    constructor(initialFish) {
        if (!Array.isArray(initialFish)) {
            throw new Error('The initial fish for the pool are not in the right format. Expecting an array');
        }

        this.pool = initialFish.reduce((acc, timer) => {
            if (!acc.hasOwnProperty(timer)) {
                acc[timer] = 0;
            }
            acc[timer]++;
            return acc;
        }, this.generateEmptyPool());
    }

    simulate(days) {
        for (let i = 0; i < days; i++) {
            const newPool = this.generateEmptyPool();
            Object.entries(this.pool).forEach(([timer, counter]) => {
                if (parseInt(timer) === 0) {
                    newPool[6] = counter;
                    newPool[8] = counter;
                } else {
                    newPool[timer - 1] += counter;
                }
            });
            this.pool = newPool;
        }

        return Object.values(this.pool).reduce((acc, counter) => acc + counter, 0);
    }

    generateEmptyPool() {
        return Array(9).fill(0).reduce((acc, item, index) => {
            acc[index] = item;
            return acc;
        }, {});
    }
}

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .flatMap(l => l.split(','));

module.exports = {
    'Part #1': new LanternFishPool(initialInput).simulate(80),
    'Part #2': new LanternFishPool(initialInput).simulate(256)
}