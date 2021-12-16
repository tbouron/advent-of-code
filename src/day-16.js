const fs = require('fs');
const path = require('path');

const hexMapping = {
    0: '0000',
    1: '0001',
    2: '0010',
    3: '0011',
    4: '0100',
    5: '0101',
    6: '0110',
    7: '0111',
    8: '1000',
    9: '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111'
}

function packetVersion(bin) {
    return parseInt(bin.substr(0, 3), 2);
}

function packetType(bin) {
    return parseInt(bin.substr(3, 3), 2);
}

function hexToBin(hex) {
    return hex.split('').map(char => hexMapping[char]).join('');
}

function parse(bin, versions, numbers, depth = 0, upTo = 0) {
    let count = 0;
    let index = 0;
    while (index < bin.length && (upTo === 0 || count < upTo)) {
        count++;
        const headersBitsLength = 6;
        const headers = bin.substr(index, headersBitsLength);

        const currentVersion = packetVersion(headers);
        versions.push(currentVersion);

        const currentType = packetType(headers);

        if (currentType === 4) {
            // Literal value
            const literalPacket = parseLiteral(bin.substr(index), numbers);
            console.debug(`${Array(depth).fill('==').join('')}=> Read literal: version [${currentVersion}] | type [${currentType}] ########## ${literalPacket.result}`);
            index += literalPacket.length;
        } else {
            // Operators
            const innerNumbers = [];
            const operatorPacket = parseOperator(bin.substr(index), versions, innerNumbers, depth);
            switch (currentType) {
                case 0:
                    numbers.push(innerNumbers.reduce((sum, number) => sum + number, 0));
                    break;
                case 1:
                    numbers.push(innerNumbers.reduce((sum, number) => sum * number, 1));
                    break;
                case 2:
                    numbers.push(Math.min(...innerNumbers));
                    break;
                case 3:
                    numbers.push(Math.max(...innerNumbers));
                    break;
                case 5:
                    numbers.push(innerNumbers[0] > innerNumbers[1] ? 1 : 0);
                    break;
                case 6:
                    numbers.push(innerNumbers[0] < innerNumbers[1] ? 1 : 0);
                    break;
                case 7:
                    numbers.push(innerNumbers[0] === innerNumbers[1] ? 1 : 0);
                    break;
                default:
                    throw new Error(`Operator type ${currentType} not supported!`);
            }


            console.debug(`${Array(depth).fill('==').join('')}=> Read operator: version [${currentVersion}] | type [${currentType}] --- mode [${operatorPacket.mode}]`);
            index += operatorPacket.length;
        }

        if (depth === 0 && 0 < bin.length - index && bin.length - index < 11 && bin.substr(index).split('').every(s => s === '0')) {
            console.debug(`Ignoring padding [${bin.substr(index)}]`);
            index += bin.substr(index).split('').length;
        }
    }

    return index;
}

function parseLiteral(bin, numbers) {
    let length = 6;
    let end = false;
    let resultBin = '';
    while (!end) {
        const encodedDigit = bin.substr(length, 5);
        if (encodedDigit.startsWith('0')) {
            end = true;
        }
        resultBin += encodedDigit.substr(1);
        length += 5;
    }

    const result = parseInt(resultBin, 2);

    numbers.push(result);

    return {
        length,
        result
    };
}

function parseOperator(bin, versions, numbers, depth = 0) {
    const headerBitsLength = 6;
    const modeBitsLength = 1;
    const mode0BitsLength = 15;
    const mode1BitsLength = 11;
    const mode = parseInt(bin.substr(headerBitsLength, modeBitsLength));

    let length = headerBitsLength + modeBitsLength;
    if (mode === 0) {
        const subPacket = bin.substr(headerBitsLength + modeBitsLength, mode0BitsLength);
        const subPacketLength = parseInt(subPacket, 2);
        const subLength = parse(bin.substr(headerBitsLength + modeBitsLength + mode0BitsLength, subPacketLength), versions, numbers, depth + 1);
        if (subLength !== subPacketLength) {
            throw new Error(`Error parsing packet ${subPacket}\nLength mismatch: Got ${subLength} but expected ${subPacketLength}`);
        }
        length += mode0BitsLength + subPacketLength;
    }
    if (mode === 1) {
        length += mode1BitsLength;
        const subPackets = parseInt(bin.substr(headerBitsLength + modeBitsLength, mode1BitsLength), 2);
        length += parse(bin.substr(length), versions, numbers, depth + 1, subPackets);
    }

    return {
        length: length,
        mode: mode
    }
}

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8').trim();
const hexInput = hexToBin(initialInput);

let versions = [];
let numbers = [];
parse(hexInput, versions, numbers);

module.exports = {
    'Part #1': versions.reduce((sum, version) => sum + version, 0),
    'Part #2': numbers
};
