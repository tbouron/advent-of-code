import * as fs from 'fs';
import * as path from 'path';
import axios from "axios";
import {config} from 'dotenv';
import * as jsdom from 'jsdom';

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

const baseUrl = `https://adventofcode.com/${process.env.YEAR}/day/${process.env.DAY}`;
const basePath = path.join(__dirname, `../${process.env.YEAR}`);
const inputFilePath = path.join(basePath, `day-${process.env.DAY}.txt`);
const testInputFilePath = path.join(basePath, `day-${process.env.DAY}.test.txt`);

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
}

if (!fs.existsSync(inputFilePath)) {
    axios.get<string>(
        `${baseUrl}/input`,
        {
            headers: {
                Cookie: `session=${process.env.SESSION}`
            }
        }).then(response => {
        fs.writeFileSync(inputFilePath, response.data);
            console.log(`Input data written in ${inputFilePath}`);
        }).catch(error => {
            throw new Error(`Failed to get or write input data: ${error.message}`);
        });
} else {
    console.log('Input data already fetched => Skipping')
}

if (!fs.existsSync(testInputFilePath)) {
    axios.get<string>(baseUrl).then(response => {
        let dom = new jsdom.JSDOM(response.data);
        let htmlElement = dom.window.document.querySelector("code");
        if (htmlElement === null) {
            throw new Error('Input test data not found!');
        }
        fs.writeFileSync(testInputFilePath, htmlElement.textContent ?? '');
        console.log(`Test input data written in ${testInputFilePath}`);
    }).catch(error => {
        throw new Error(`Failed to get or write test input data: ${error.message}`);
    });
} else {
    console.log('Test input data already fetched => Skipping');
}



