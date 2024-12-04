import * as fs from 'fs';
import * as path from 'path';
import {expandRange, sum, union} from '../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

const isReportSafe = (report: number[]) => {
    const isIncreasing = (report[1] - report[0]) > 0;
    let reportInconsistencyPredicate = (level: number, levelIndex: number, levels: number[]) => levelIndex > 0
        ? isIncreasing
            ? level - levels[levelIndex - 1] < 1
            : level - levels[levelIndex - 1] > -1
        : false;
    const reportInconsistency = report.some(reportInconsistencyPredicate);
    let levelsInconsistencyPredicate = (level: number, levelIndex: number, levels: number[]) => {
        let diff = levelIndex > 0 ? Math.abs(level - levels[levelIndex - 1]) : 1;
        return diff < 1 || diff > 3;
    };
    const levelsInconsistent = report.some(levelsInconsistencyPredicate);

    return {
        reportInconsistency,
        levelsInconsistent,
    };
}

const countSafeReports = (input: string[]) => {
    return input.map(line => line.split(/[ ]/).map(level => parseInt(level)))
        .map((report, index) => {
            const results = isReportSafe(report);
            const isSafe = !results.reportInconsistency && !results.levelsInconsistent;

            debug(`Report #${index + 1} [${report}]: Report inconsistency ${results.reportInconsistency} – levels inconsistency ${results.levelsInconsistent} => Is safe ${isSafe}`);

            return isSafe;
        })
        .filter(safeReport => safeReport === true)
        .length;
}

const countSafeReportsWithDampeners = (input: string[]) => {
    return input.map(line => line.split(/[ ]/).map(level => parseInt(level)))
        .map((report, index) => {
            let results = isReportSafe(report);

            let isSafe = !results.reportInconsistency && !results.levelsInconsistent;

            debug(`Report #${index + 1} [${report}]: Report inconsistency ${results.reportInconsistency} – levels inconsistency ${results.levelsInconsistent} => Is safe ${isSafe}`);
            if (!isSafe) {
                for (const indexToRemove of expandRange(0, report.length - 1)) {
                    debug(`Report #${index + 1} => Removing level ${report[indexToRemove]}`);
                    const updatedReport = Array.from(report);
                    updatedReport.splice(indexToRemove, 1);
                    results = isReportSafe(updatedReport);
                    isSafe = !results.reportInconsistency && !results.levelsInconsistent;
                    debug(`Report #${index + 1} [${updatedReport}]: Report inconsistency ${results.reportInconsistency} – levels inconsistency ${results.levelsInconsistent} => Is safe ${isSafe}`);
                    if (isSafe) {
                        break;
                    }
                }
            }

            return isSafe;
        })
        .filter(safeReport => safeReport === true)
        .length;
}

export const Part1 = countSafeReports(rawTestInput);
export const Part2 = countSafeReportsWithDampeners(rawInput);