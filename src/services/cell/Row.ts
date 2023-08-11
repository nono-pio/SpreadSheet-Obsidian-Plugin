import CellConfig from "./CellConfig";

export default class Row {
	value: string | null;
	config: CellConfig | null;
	constructor(value: string | null = null, config: CellConfig | null = null) {
		this.config = config;
		this.value = value;
	}

	getText(index: number): string {
		return "" + (index + 1);
	}

	getData() {
		return this.value ? this.value : "";
	}
}
