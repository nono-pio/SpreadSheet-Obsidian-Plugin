import Formula from "./Formula";

export default class LinkCell extends Formula<string> {
	row: number;
	column: number;
	constructor(row: number, column: number) {
		super();
		this.column = column;
		this.row = row;
	}

	GetValue(): string {
		return `row${this.row} column${this.column}`;
	}
}
