import * as fs from 'fs';
import * as path from 'path';
import {performance} from 'perf_hooks';

const dayToRun = parseInt(process.env.DAY || '0') || 0;
const sourceFolder = 'src';

const suiteStart = performance.now();

fs.readdirSync(sourceFolder)
    .filter(file => file.endsWith('.ts'))
    .filter(file => dayToRun > 0 ? file === `day-${dayToRun}.ts` : true)
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
    .map(file => path.join(__dirname, sourceFolder, file))
    .map(file => {
        const match = file.match(/day-(.*).ts/);
        const dayNumber = match !== null ? match[1] : '???';
        const start = performance.now();
        let exports;
        let error;
        try {
            exports = require(file);
        } catch (ex) {
            error = ex;
        }

        const stats = [
            `ex. time ${(performance.now() - start).toFixed(2)} ms`,
            `mem. used: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
        ];

        return {
            day: dayNumber,
            exports,
            error,
            stats
        }
    }).forEach(o => {
        const message = [`=== DAY #${o.day} (${o.stats.join(' | ')})`];
        if (o.exports) {
            message.push(...Object.entries(o.exports).map(([exportKey, exportValue]) => `|-> [${exportKey}] ${exportValue}`));
        }
        if (o.error) {
            message.push(`[X] An error occurred while executing the script`, '');
        }

        console.log(message.join('\n'), o.error ? o.error : '');
    });

if (dayToRun === 0) {
    console.log([
        '\n',
        `=== Total suite ex. time: ${(performance.now() - suiteStart).toFixed(2)} ms === `
    ].join('\n'));
}
