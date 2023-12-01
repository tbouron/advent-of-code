import * as fs from "fs";
import * as path from "path";
import {multiply} from "../../util";

enum Operator {
    PLUS,
    STAR
}

type Monkey = {
    items: number[]
    inspection: number
    inspect: {
        operator: Operator
        value?: number
    },
    predicate: {
        dividedBy: number
        monkeyIndexIfTrue: number
        monkeyIndexIfFalse: number
    }
}

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n\n');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n\n');

function parseMonkeys(rawMonkeys: string[]) {
    return rawMonkeys.map(rawMonkey => rawMonkey
        .split('\n')
        .reduce((monkey, line, index) => {
            if (index === 0) {
                return monkey
            }
            // Parse items
            if (index === 1) {
                monkey.items = line.match(/(\d+)/gi)!.map(v => parseInt(v));
            }
            // Parse operation
            if (index === 2) {
                const matches = line.match(/(\+|\*) (old|\d+)$/);
                monkey.inspect.operator = matches && matches[1] === '*' ? Operator.STAR : Operator.PLUS;
                if (matches && matches[2] !== 'old') {
                    monkey.inspect.value = parseInt(matches[2]);
                }

            }
            // Parse the test, i.e. predicate
            if (index === 3) {
                monkey.predicate.dividedBy = line.match(/(\d+)/gi)!.map(v => parseInt(v))[0];
            }
            // Parse the then statement if true
            if (index === 4) {
                monkey.predicate.monkeyIndexIfTrue = line.match(/(\d+)/gi)!.map(v => parseInt(v))[0];
            }
            // Parse the then statement if true
            if (index === 5) {
                monkey.predicate.monkeyIndexIfFalse = line.match(/(\d+)/gi)!.map(v => parseInt(v))[0];
            }
            return monkey;
        }, {
            inspection: 0,
            items: [],
            inspect: {
                operator: Operator.PLUS,
            },
            predicate: {
                dividedBy: 0,
                monkeyIndexIfTrue: -1,
                monkeyIndexIfFalse: -1
            }
        } as Monkey));
}

function keepAway(monkeys: Monkey[], rounds = 20, applyRelief: boolean = true) {
    const superModulo = multiply(monkeys.map(m => m.predicate.dividedBy));

    for (let round = 0; round < rounds; round++) {
        for (const monkey of monkeys) {
            while (monkey.items.length > 0) {
                const item = monkey.items.shift()!;

                let newItem = 0;
                switch (monkey.inspect.operator) {
                    case Operator.PLUS:
                        newItem = !!monkey.inspect.value ? item + monkey.inspect.value : item + item;
                        break;
                    case Operator.STAR:
                        newItem = !!monkey.inspect.value ? item * monkey.inspect.value : item * item;
                        break;
                }
                monkey.inspection++;
                if (applyRelief) {
                    newItem = Math.floor(newItem / 3);
                } else {
                    newItem = newItem % superModulo;
                }
                monkeys[newItem % monkey.predicate.dividedBy === 0
                    ? monkey.predicate.monkeyIndexIfTrue
                    : monkey.predicate.monkeyIndexIfFalse
                    ].items.push(newItem);
            }
        }
    }
}

function calculateMonkeyBusiness(monkeys: Monkey[]) {
    return multiply(monkeys
        .map(monkey => monkey.inspection)
        .sort((a, b) => b - a)
        .slice(0, 2));
}

const monkeysPart1 = parseMonkeys(rawInput);
const monkeysPart2 = parseMonkeys(rawInput);

keepAway(monkeysPart1, 20, true);
keepAway(monkeysPart2, 10000, false);

export const Part1 = calculateMonkeyBusiness(monkeysPart1);
export const Part2 = calculateMonkeyBusiness(monkeysPart2);
