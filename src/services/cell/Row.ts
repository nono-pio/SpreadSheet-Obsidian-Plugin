import CellConfig from "./CellConfig";

export default class Row {
	value: string;
	index: number;
	config: CellConfig | null;
	constructor(
		value: string | null,
		index: number,
		config: CellConfig | null = null
	) {
		this.config = config;
		this.value = value || index + 1 + "";
		this.index = index;
	}

	getText(): string {
		return this.value;
	}

	getData() {
		return this.value === this.index + 1 + "" ? "" : this.value;
	}
}
