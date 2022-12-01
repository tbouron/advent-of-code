# advent-of-code-2021

This folder contains the code for the [Advent of Code 2022](https://adventofcode.com/2022).

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

_Note that the runner will output the time & memory consumption for each day._

## How to add days?

Simply create a `day-<number>.ts` in the `src` folder, and make sure to `export` each part as a `string`.