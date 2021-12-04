const fs = require('fs');
const path = require('path');

const dayToRun = parseInt(process.env.DAY) || 0;
const sourceFolder = 'src';

const filteredDayFiles = fs.readdirSync(sourceFolder)
    .filter(file => file.endsWith('.js'))
    .filter(file => dayToRun > 0 ? file === `day-${dayToRun}.js` : true);

if (filteredDayFiles.length === 0) {
    console.log(`Nothing to run`);
} else {
    Promise.allSettled(filteredDayFiles.map(dayFile => {
        const match = dayFile.match(/day-(.*).js/);
        const dayNumber = match !== null ? match[1] : '???';
        return import(`./${path.join(sourceFolder, dayFile)}`).then(dayExports => {
            return {
                day: dayNumber,
                exports: dayExports
            };
        }).catch(error => {
            throw {
                day: dayNumber,
                error: error
            };
        })
    })).then(dayImports => {
        dayImports.forEach((dayImport) => {
            const log = [];
            switch (dayImport.status) {
                case 'fulfilled':
                    log.push(`==== DAY #${dayImport.value.day}`, ...Object.entries(dayImport.value.exports.default).map(([exportKey, exportValue]) => `${exportKey} => ${exportValue}`));
                    break
                case 'rejected':
                    log.push(`==== DAY #${dayImport.reason.day}`, `[x] ${dayImport.reason.error}`);
                    break;
            }
            console.log(log.join('\n'));
        });
    }).catch(ex => console.error(ex));
}