import Cell from "./Cell";
import CellConfig from "./CellConfig";

export default class DefaultCell extends Cell {
	value: string;
	constructor(value = "", config: CellConfig | null = null) {
		super(config);
		this.value = value;
	}

	getCellText(): string {
		return this.value;
	}

	getCellTextEnter(): string {
		return this.value;
	}

	getData(): string {
		return this.value;
	}
}
