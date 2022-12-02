import * as fs from 'fs';
import * as path from 'path';

enum Choice {
    // Rock
    A = 1,
    X = 1,
    // Paper
    B = 2,
    Y = 2,
    // Scissor
    C = 3,
    Z = 3
}

enum GameOutput {
    // Loose
    X,
    // Draw
    Y,
    // Win
    Z
}

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .split('\n')
    .filter(line => line.length > 0);

const part1 = parsedInput.map(round => {
    const roundInput = round.trim().split(' ');

    const opponentChoice = Choice[roundInput[0] as keyof typeof Choice];
    const elfChoice = Choice[roundInput[1] as keyof typeof Choice];

    const elfScore = elfChoice.valueOf();
    if (elfChoice === opponentChoice) {
        return elfScore + 3;
    } else if (elfChoice === Choice.X) {
        return elfScore + (opponentChoice === Choice.C ? 6 : 0);
    } else if (elfChoice === Choice.Y) {
        return elfScore + (opponentChoice === Choice.A ? 6 : 0);
    } else if (elfChoice === Choice.Z) {
        return elfScore + (opponentChoice === Choice.B ? 6 : 0);
    }
    return elfScore;
});

const part2 = parsedInput.map(round => {
    const input = round.trim().split(' ');

    const opponentChoice = Choice[input[0] as keyof typeof Choice];
    const gameOutput = GameOutput[input[1] as keyof typeof GameOutput];

    switch (gameOutput) {
        case GameOutput.X:
            return opponentChoice === Choice.A
                ? Choice.Z.valueOf()
                : opponentChoice === Choice.B
                    ? Choice.X.valueOf()
                    : Choice.Y.valueOf();
        case GameOutput.Y:
            return 3 + opponentChoice.valueOf();
        case GameOutput.Z:
            return 6 + (opponentChoice === Choice.A
                ? Choice.Y.valueOf()
                : opponentChoice === Choice.B
                    ? Choice.Z.valueOf()
                    : Choice.X.valueOf())
    }
});

export const Part1 = `Score with incomplete instructions: ${part1.reduce((total, roundScore) => total + roundScore, 0)}`;
export const Part2 = `Score with complete instructions: ${part2.reduce((total, roundScore) => total + roundScore, 0)}`;