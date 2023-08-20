import CellManager from "../cell/CellManager";
import { Token, TokenType, tokenize } from "./FormulaLexer";
import {
	Binary,
	Func,
	LinkCell,
	Node,
	NopNode,
	Num,
	Prop,
	Str,
} from "./FormulaNode";

export default function parseFormula(formula: string): Node {
	const tokens = tokenize(formula);
	return parseTokens(tokens);
}

function parseTokens(tokens: Token[]): Node {
	let node: Node = new NopNode();

	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];

		switch (token.tokenDefinition.type) {
			case TokenType.CELL:
				node = new LinkCell(...getIndexColRow(token.value));
				break;
			case TokenType.PARENTHESIS: {
				const endParenthesisIndex =
					findClosingParenthesisIndex(tokens, index) + 1;
				node = parseTokens(
					tokens.slice(index + 1, endParenthesisIndex)
				);
				break;
			}
			case TokenType.OPERATOR: {
				const op = getOp(token.value);
				if (op) {
					return new Binary(
						node,
						parseTokens(tokens.slice(index + 1)),
						op.getFormula
					);
				}
				break;
			}
			case TokenType.NUMBER:
				node = new Num(parseFloat(token.value));
				break;
			case TokenType.ID: {
				const propValue = CellManager.instance.getPropValue(
					token.value
				);
				if (propValue) {
					node = new Prop(propValue);
					break;
				} else {
					for (const func of funcs) {
						if (token.value.toUpperCase() === func.name) {
							const [nodes, endIndex] = getNodes(
								tokens,
								index + 1,
								func.lenght
							);
							index = endIndex;

							node = new Func(func.call, nodes);
							break;
						}
					}
					break;
				}
			}
			case TokenType.STRING:
				node = new Str(
					token.value.substring(1, token.value.length - 1)
				);
				break;
		}
	}
	return node;
}

function getNodes(
	tokens: Token[],
	index: number,
	lenght: number
): [Node[], number] {
	const endParenthesisIndex = findClosingParenthesisIndex(tokens, index);

	let startIndex = index + 1;
	const nodes: Node[] = [];

	for (let i = index + 1; i < endParenthesisIndex - 1; i++) {
		const token = tokens[i];
		if (token.value === ";") {
			nodes.push(parseTokens(tokens.slice(startIndex, i)));
			startIndex = i + 1;
		} else if (token.value === "(") {
			i = findClosingParenthesisIndex(tokens, i);
		}
	}
	nodes.push(parseTokens(tokens.slice(startIndex, endParenthesisIndex)));

	return [nodes, endParenthesisIndex];
}

function findClosingParenthesisIndex(
	tokens: Token[],
	startIndex: number
): number {
	let openCount = 0;

	for (let i = startIndex; i < tokens.length; i++) {
		if (tokens[i].value === "(") {
			openCount++;
		} else if (tokens[i].value === ")") {
			openCount--;
			if (openCount === 0) {
				return i;
			}
		}
	}

	return tokens.length - 1;
}

export function getIndexColRow(input: string): [col: number, row: number] {
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

function getOp(opStr: string): Arithmetic | undefined {
	for (const op of ops) {
		if (op.id === opStr) {
			return op;
		}
	}
	return undefined;
}

class Arithmetic {
	id: string;
	priority: number;
	getFormula: (a: number, b: number) => number;
}
const ops: Arithmetic[] = [
	{
		id: "+",
		priority: 5,
		getFormula: (a, b) => a + b,
	},
	{
		id: "-",
		priority: 4,
		getFormula: (a, b) => a - b,
	},
	{
		id: "*",
		priority: 3,
		getFormula: (a, b) => a * b,
	},
	{
		id: "/",
		priority: 2,
		getFormula: (a, b) => a / b,
	},
	{
		id: "%",
		priority: 1,
		getFormula: (a, b) => a % b,
	},
	{
		id: "^",
		priority: 0,
		getFormula: (a, b) => Math.pow(a, b),
	},
];

class FX {
	name: string;
	lenght: number;
	call: (nodes: Node[]) => Node;
}
export const funcs: FX[] = [
	{
		name: "TEST",
		lenght: 2,
		call: (nodes) => new Num(nodes[0].getNumber() + nodes[1].getNumber()),
	},
];
