# advent-of-code-2021

This repo contains the code for the [Advent of Code 2021](https://adventofcode.com/2021).

## How ot run?

Once cloned, install the dependencies with `npm i` then simply run:
```bash
npm run puzzles

*OR*

node index.ts
```

and it will output the answers for each day, where the sources are present.

You can run a specific day by specifying the envvar `DAY` like so:
```bash
DAY=2 npm run puzzles

*OR*

DAY=2 node index.ts
```

If you want to see the debug logs, you can use the envvar `DEBUG` like so:
```bash
DEBUG=* npm run puzzle # Will output ALL debug logs

*OR*

DEBUG=day-1.js,day-2.js,day-3.js npm run puzzle # Will output the debug logs only for day 1, 2 and 30 
```

_Note that the runner will output the memory consumption for each day if you specify the `--expose-gc` node arguments. The command `npm run puzzles` specifies it automatically._

## How to add days?

Simply create a `day-<number>.js` in the `src` folder, and make sure the `module.export` returns an object.