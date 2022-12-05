import * as fs from 'fs';
import * as path from 'path';
import axios from "axios";
import {config} from 'dotenv';

config();

const errors: string[] = [];
const requiredEndVars = ['YEAR', 'DAY', 'SESSION'];
requiredEndVars.forEach(requiredEnvVar => {
    if (!process.env[requiredEnvVar]) {
        errors.push(`Missing environment variable [${requiredEnvVar}]`);
    }
});

if (errors.length > 0) {
    throw new Error([...errors, 'You can specify the environment variable before the command, or in the .env file'].join('\n'))
}

axios.get<string>(
    `https://adventofcode.com/${process.env.YEAR}/day/${process.env.DAY}/input`,
    {
        headers: {
            Cookie: `session=${process.env.SESSION}`
        }
    }).then(response => {
        fs.writeFileSync(path.join(__dirname, `../${process.env.YEAR}/src/day-${process.env.DAY}.txt`), response.data);
        console.log(`Input data written in ../${process.env.YEAR}/src/day-${process.env.DAY}.txt`);
    }).catch(error => {
        throw new Error(`Failed to get or write input data: ${error.message}`);
    });