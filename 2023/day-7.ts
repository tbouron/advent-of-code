import * as fs from 'fs';
import * as path from 'path';
import {expandRange, intersection, multiply, sum} from '../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

enum HandType {
    FIVE_OF_KIND,
    FOUR_OF_KIND,
    FULL_HOUSE,
    THREE_OF_KIND,
    DOUBLE_PAIR,
    SINGLE_PAIR,
    HIGH_CARD
}

type Hand = {
    cards: string[]
    type: HandType
    bid: number
}

const relativeStrengthWithoutJoker = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const relativeStrengthWithJoker = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

const parseHand = (line: string, withJokers = false): Hand => {
    const hand: Hand = {
        cards: [],
        type: HandType.HIGH_CARD,
        bid: 0
    }

    const [cardSets, bid] = line.trim()
        .split(/\s+/);

    hand.bid = parseInt(bid);

    const cards = cardSets
        .split('');

    hand.cards = cards;

    const cardsMapping = cards
        .reduce((map, card) => {
            if (!map.hasOwnProperty(card)) {
                map[card] = 0;
            }
            map[card]++;
            return map;
        }, {} as {[p: string]: number});

    const jokers = cardsMapping.hasOwnProperty('J') ? cardsMapping.J : 0;

    if (withJokers && jokers > 0) {
        delete cardsMapping.J;
    }

    const values = Object.values(cardsMapping);
    if (values.includes(5)) {
        hand.type = HandType.FIVE_OF_KIND;
    } else if (values.includes(4)) {
        hand.type = HandType.FOUR_OF_KIND;
    } else if (values.includes(3) && values.includes(2)) {
        hand.type = HandType.FULL_HOUSE;
    } else if (values.includes(3)) {
        hand.type = HandType.THREE_OF_KIND;
    } else if (values.includes(2) && values.indexOf(2) !== values.lastIndexOf(2)) {
        hand.type = HandType.DOUBLE_PAIR;
    } else if (values.includes(2)) {
        hand.type = HandType.SINGLE_PAIR;
    } else {
        hand.type = HandType.HIGH_CARD;
    }

    if (withJokers && jokers > 0) {
        debug(`Jokers found: [${jokers}] in hand ${cardSets}. Type before: ${hand.type}`);
        if (hand.type === HandType.HIGH_CARD) {
            hand.type = [HandType.SINGLE_PAIR, HandType.THREE_OF_KIND, HandType.FOUR_OF_KIND, HandType.FIVE_OF_KIND, HandType.FIVE_OF_KIND].at(jokers - 1)!;
        } else if (hand.type === HandType.SINGLE_PAIR) {
            hand.type = [HandType.THREE_OF_KIND, HandType.FOUR_OF_KIND, HandType.FIVE_OF_KIND].at(jokers - 1)!;
        } else if (hand.type === HandType.DOUBLE_PAIR) {
            hand.type = HandType.FULL_HOUSE
        } else if (hand.type === HandType.THREE_OF_KIND) {
            hand.type = [HandType.FOUR_OF_KIND, HandType.FIVE_OF_KIND].at(jokers - 1)!;
        } else if (hand.type === HandType.FOUR_OF_KIND) {
            hand.type = HandType.FIVE_OF_KIND;
        }
    }

    debug(hand);

    return hand;
};

const sortHand = (a: Hand, b: Hand, relativeStrength: string[] = relativeStrengthWithoutJoker) => {
    const typeStrength = b.type - a.type;

    if (typeStrength !== 0) {
        return typeStrength
    }

    for (let i = 0; i < a.cards.length; i++) {
        const cardStrength = relativeStrength.indexOf(b.cards[i]) - relativeStrength.indexOf(a.cards[i]);
        if (cardStrength !== 0) {
            return cardStrength;
        }
    }

    return 0;
};

const calculateTotalWinnings = (total: number, hand: Hand, index: number) => total + (index + 1) * hand.bid;

const part1 = rawInput
    .map(line => parseHand(line))
    .sort((a, b) => sortHand(a, b))
    .reduce(calculateTotalWinnings, 0);

const part2 = rawInput
    .map(line => parseHand(line, true))
    .sort((a, b) => sortHand(a, b, relativeStrengthWithJoker))
    .reduce(calculateTotalWinnings, 0);

export const Part1 = part1;
export const Part2 = part2;