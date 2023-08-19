import CellConfig from "./CellConfig";

export default abstract class Cell {
	config: CellConfig | null;

	constructor(config: CellConfig | null = null) {
		this.config = config;
	}

	abstract getCellText(): string;

	abstract getCellTextEnter(): string;

	abstract getData(): string;
}

export type CellPos = [column: number, row: number];
