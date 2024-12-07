import * as fs from 'fs';
import * as path from 'path';
import {performance} from 'perf_hooks';

const readableTime = (milliseconds: number) => {
    const s = 1000;
    const m = s * 60;
    const h = m * 60;
    const d = h * 24;
    const w = d * 7;
    const y = d * 365.25;
    const time = {
        year: 0,
        week: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
    }
    if (milliseconds > y) {
        time.year = Math.floor(milliseconds / y);
        milliseconds -= time.year * y;
    }
    if (milliseconds > w) {
        time.week = Math.floor(milliseconds / w);
        milliseconds -= time.week * w;
    }
    if (milliseconds > d) {
        time.day = Math.floor(milliseconds / d);
        milliseconds -= time.day * d;
    }
    if (milliseconds > h) {
        time.hour = Math.floor(milliseconds / h);
        milliseconds -= time.hour * h;
    }
    if (milliseconds > m) {
        time.minute = Math.floor(milliseconds / m);
        milliseconds -= time.minute * m;
    }
    if (milliseconds > s) {
        time.second = Math.floor(milliseconds / s);
        milliseconds -= time.second * s;
    }
    time.millisecond = milliseconds;

    return Object.entries(time)
        .filter(([unit, value]) => value > 0)
        .map(([unit, value]) => `${value.toFixed(0)} ${unit}${value > 1 ? 's' : ''}`)
        .join(', ');
}

const yearToRun = process.env.YEAR || new Date().getFullYear().toString();
const dayToRun = parseInt(process.env.DAY || '0') || 0;

const suiteStart = performance.now();

fs.readdirSync(yearToRun)
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
    .filter(file => dayToRun > 0 ? file.match(`day-${dayToRun}.(ts|js)`) !== null : true)
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
    .map(file => path.join(__dirname, yearToRun, file))
    .map(file => {
        const match = file.match(/day-(.*).(ts|js)/);
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
            `ex. time ${readableTime(performance.now() - start)}`,
            `mem. used: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
        ];

        return {
            year: yearToRun,
            day: dayNumber,
            exports,
            error,
            stats
        }
    }).forEach(o => {
        const message = [`=== [YEAR ${o.year}] DAY #${o.day} (${o.stats.join(' | ')})`];
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
        `=== Total suite ex. time: ${readableTime(performance.now() - suiteStart)}  === `
    ].join('\n'));
}
