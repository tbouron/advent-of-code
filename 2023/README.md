# advent-of-code-2023

This folder contains the code for the [Advent of Code 2023](https://adventofcode.com/2023).

## How ot run?

Once cloned, install the dependencies with `npm i` then simply run:
```bash
npm run puzzles

*OR*

ts-node index.ts
```

and it will output the answers for each day, where the sources are present.

You can run a specific day by specifying the envvar `DAY` like so:
```bash
DAY=2 npm run puzzles

*OR*

DAY=2 ts-node index.ts
```

If you want to see the debug logs, you can use the envvar `DEBUG` like so:
```bash
DEBUG=* npm run puzzle # Will output ALL debug logs

*OR*

DEBUG=day-1.ts,day-2.ts,day-3.ts npm run puzzle # Will output the debug logs only for day 1, 2 and 3
```

_Note that the runner will output the time & memory consumption for each day._

## How to add days?

Simply create a `day-<number>.ts` in the `src` folder, and make sure to `export` each part as a `string`.