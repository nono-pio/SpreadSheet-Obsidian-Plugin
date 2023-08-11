import Binary from "./Binary";
import Formula from "./Formula";
import LinkCell from "./LinkCell";

const ID = /^[a-zA-Z]+/;
const CellAddr = /^[a-zA-Z]+\d+/;

export default function parseFormula(formula: string): Formula<unknown> {
	formula = formula.replace(" ", "");
	let result: Formula<unknown> | null = null;
	let errorToken = false;

	while (formula !== "") {
		const matchCellAddr = matchStart(formula, CellAddr);
		if (matchCellAddr !== "") {
			// 1
			const indexs = getIndexColRow(matchCellAddr); // [col, row]
			result = new LinkCell(indexs[1], indexs[0]);
			formula = formula.substring(matchCellAddr.length, formula.length);
			continue;
		}

		const matchID = matchStart(formula, ID);
		if (matchID !== "") {
			// 2
			// TODO
			continue;
		}

		if (formula.charAt(0) === "(") {
			// 4
			const indexEndParenthesis = findClosingParenthesisIndex(formula);
			result = parseFormula(formula.substring(1, indexEndParenthesis));
			formula = formula.substring(
				indexEndParenthesis + 1,
				formula.length
			);
			continue;
		}

		errorToken = true;
		for (const op of ops) {
			if (formula.startsWith(op.id)) {
				// 3
				const b = parseFormula(
					formula.substring(op.id.length, formula.length)
				);
				if (result === null || b === null) {
					throw new Error("Invalid formula");
				}
				return new Binary(op.getFormula, result, b);
			}
		}

		if (errorToken) {
			throw new Error("Token invalid");
		}
	}

	if (result === null) {
		throw new Error("Invalid Formula");
	}

	return result;
}

function matchStart(input: string, pattern: RegExp): string {
	const match = input.match(pattern);
	return match ? match[0] : "";
}

function findClosingParenthesisIndex(input: string): number {
	let openParenthesesCount = 0;

	for (let i = 0; i < input.length; i++) {
		if (input[i] === "(") {
			openParenthesesCount++;
		} else if (input[i] === ")") {
			openParenthesesCount--;
			if (openParenthesesCount === 0) {
				return i;
			}
		}
	}

	return -1; // Si aucune parenthèse fermante n'est trouvée
}

export function getIndexColRow(input: string): number[] {
	const regex = /([a-zA-Z]+)(\d+)/;
	const matches = input.match(regex);

	if (matches && matches.length === 3) {
		const letters = matches[1];
		const numbers = matches[2];
		return [letterToNumber(letters), parseInt(numbers) - 1];
	} else {
		throw new Error("Cell format invalide");
	}
}

export function letterToNumber(str: string) {
	const base = "A".charCodeAt(0) - 1;
	const chars = str.toUpperCase().split("").reverse();
	let result = 0;

	for (let i = 0; i < chars.length; i++) {
		const charCode = chars[i].charCodeAt(0) - base;
		result += charCode * Math.pow(26, i);
	}

	return result - 1;
}

class Arithmetic {
	id: string;
	getFormula: (a: number, b: number) => number;
}
const ops: Arithmetic[] = [
	{
		id: "+",
		getFormula: (a, b) => a + b,
	},
	{
		id: "-",
		getFormula: (a, b) => a - b,
	},
	{
		id: "*",
		getFormula: (a, b) => a * b,
	},
	{
		id: "/",
		getFormula: (a, b) => a / b,
	},
	{
		id: "%",
		getFormula: (a, b) => a % b,
	},
	{
		id: "^",
		getFormula: (a, b) => Math.pow(a, b),
	},
];

/*
Grammar

Expr = 
1    [a-zA-Z]+\d+ |
2    [a-zA-Z]+ ( Expr ) |
3    Expr op=(+ | - | * | / | % | ^) Expr |
4    ( Expr )

*/

/*

A2
A2 + B4
(A2 - B6) * B6
(A2 - B8)
SUM(B4 * B6; B8 + G6) - B8

*/
