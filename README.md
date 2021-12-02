# advent-of-code-2021

This repo contains the code for the [Advent of Code 2021](https://adventofcode.com/2021).

## How ot run?

Once cloned, simply run:
```bash
node index.js
```

and it will output the answers for each day, where the sources are present.

You can run a specific day by specifying the envvar `DAY` like so:
```bash
DAY=2 node index.js
```

## How to add days?

Simply create a `day-<number>.js` in the `src` folder, and make sure the `module.export` returns an object.