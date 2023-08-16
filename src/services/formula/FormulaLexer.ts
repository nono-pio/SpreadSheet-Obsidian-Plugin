export class TokenDefinition {
	regex: RegExp;
	type: TokenType;
}

export enum TokenType {
	CELL,
	NUMBER,
	OPERATOR,
	STRING,
	PARENTHESIS,
	ID,
	SEMI,
}

const tokenDefinitions: TokenDefinition[] = [
	{ regex: /^[a-zA-Z]+\d+/, type: TokenType.CELL }, //A2
	{ regex: /^\d+(\.\d+)?/, type: TokenType.NUMBER }, //1 .2 3.5
	{ regex: /^[*+\-^/]/, type: TokenType.OPERATOR }, // + - * / % ^
	{ regex: /^"[^"]*"/, type: TokenType.STRING },
	{ regex: /^[()]/, type: TokenType.PARENTHESIS }, // ()
	{ regex: /^[a-zA-Z_]+/, type: TokenType.ID }, // SUM Variable
	{ regex: /^;/, type: TokenType.SEMI },
];

export class Token {
	tokenDefinition: TokenDefinition;
	value: string;
}

export function tokenize(input: string): Token[] {
	const tokens: Token[] = [];
	let currentPosition = 0;

	while (currentPosition < input.length) {
		let matchedToken = false;

		if (input.charAt(currentPosition).match(/[ \n\t\r]/)) {
			currentPosition++;
			continue;
		}

		for (const tokenDef of tokenDefinitions) {
			const regexResult = input
				.substring(currentPosition)
				.match(tokenDef.regex);

			if (regexResult && regexResult.index === 0) {
				const tokenValue = regexResult[0];
				tokens.push({ tokenDefinition: tokenDef, value: tokenValue });
				currentPosition += tokenValue.length;
				matchedToken = true;
				break;
			}
		}

		if (!matchedToken) {
			throw new Error(
				`Unrecognized token at position ${currentPosition}`
			);
		}
	}

	return tokens;
}
