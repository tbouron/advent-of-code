# advent-of-code

This project contains the code for the multiple years of [Advent of Code](https://adventofcode.com).

## How to run?

Once cloned, install the dependencies with `npm i` then simply run:
```bash
YEAR=2024 npm run puzzles
```

and it will output the answers for each day, where the sources are present.

You can run a specific day by specifying the envvar `DAY` like so:
```bash
YEAR=2024 DAY=2 npm run puzzles
```

If you want to see the debug logs, you can use the envvar `DEBUG` like so:
```bash
DEBUG=* npm run puzzles # Will output ALL debug logs

*OR*

DEBUG=day-1.ts,day-2.ts,day-3.ts npm run puzzles # Will output the debug logs only for day 1, 2 and 3
```

_Note that the runner will output the time & memory consumption for each day._

## How to add days?

Simply create a `day-<number>.ts` in the "year" folder, and make sure to `export` each part as a `string`.

You can also automatically get the puzzle test and main inputs with the bootstrapper. To do this, simply run:
```bash
YEAR=2024 DAY=1 SESSION=abcdef.... npm run bootstrap
```

and it will download and store the input data into the file `../2024/day-1.txt`.

_Note #1: the session value is the value of the cookie `session`, which is usually valid for a month. Setting it once
per year should be enough_

_Note #2: envvar can be passed directly to the CLI command, stored in the `.env` file or a combination of both. For instance,
I would recommend to set `YEAR` and `SESSION` in the `.env` file but specify `DAY` each day._
