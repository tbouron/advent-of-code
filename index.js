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
    Promise.all(filteredDayFiles.map(dayFile => import(`./${path.join(sourceFolder, dayFile)}`)))
        .then(dayExports => {
            dayExports.forEach((dayExport, index) => {
                console.log(Array.of(`==== DAY #${dayExports.length === 1 ? dayToRun : index + 1}`)
                    .concat(Object.entries(dayExport.default).map(([exportKey, exportValue]) => `${exportKey} => ${exportValue}`))
                    .join('\n'));
            });
        }).catch(ex => console.error(ex));
}