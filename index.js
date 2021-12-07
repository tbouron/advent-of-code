const fs = require('fs');
const path = require('path');
const {performance} = require('perf_hooks');

const dayToRun = parseInt(process.env.DAY) || 0;
const sourceFolder = 'src';

fs.readdirSync(sourceFolder)
    .filter(file => file.endsWith('.js'))
    .filter(file => dayToRun > 0 ? file === `day-${dayToRun}.js` : true)
    .map(file => path.join(__dirname, sourceFolder, file))
    .map(file => {
        const match = file.match(/day-(.*).js/);
        const dayNumber = match !== null ? match[1] : '???';
        const start = performance.now();
        let exports;
        let error;
        try {
            if (global.gc) {
                global.gc();
            }
            exports = require(file);
        } catch (ex) {
            error = ex;
        }

        const stats = [
            `ex. time ${(performance.now() - start).toFixed(2)} ms`
        ];
        if (global.gc) {
            stats.push(`mem. used: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
        }

        return {
            day: dayNumber,
            exports,
            error,
            stats
        }
    }).forEach(o => {
        const message = [`=== DAY #${o.day} (${o.stats.join(' | ')})`];
        if (o.exports) {
            message.push(...Object.entries(o.exports).map(([exportKey, exportValue]) => `|-> ${exportKey} => ${exportValue}`));
        }
        if (o.error) {
            message.push(`[X] An error occurred while executing the script`, '');
        }

        console.log(message.join('\n'), o.error ? o.error : '');
    });