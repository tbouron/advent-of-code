# Advent of Code bootstrapper

This node module is meant to download and store the input data of the current `YEAR` and `DAY` from the command line
instead of copy-pasting it every single day.

## Usage

Simply run: 
```bash
YEAR=2022 DAY=1 SESSION=abcdef.... npm run bootstap
```

and it will download and store the input data into the file `../2022/src/day-1.txt`.

_Note #1: the session value is the value of the cookie `session`, which is usually valid for a month. Setting it once
per year should be enough_

_Note #2: envvar can be passed directly to the CLI command, stored in the `.env` file or a combination of both. For instance, 
I would recommend to set `YEAR` and `SESSION` in the `.env` file but specify `DAY` each day._
