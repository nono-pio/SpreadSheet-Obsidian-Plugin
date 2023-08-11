import CellConfig from "./CellConfig";

export default class Column {
	value: string | null;
	config: CellConfig | null;
	constructor(value: string | null = null, config: CellConfig | null = null) {
		this.config = config;
		this.value = value;
	}

	getText(index: number): string {
		return this.value ? this.value : this.toLetter(index);
	}

	toIndex(str: string): number {
		const base = "A".charCodeAt(0) - 1;
		const chars = str.toUpperCase().split("").reverse();
		let result = 0;

		for (let i = 0; i < chars.length; i++) {
			const charCode = chars[i].charCodeAt(0) - base;
			result += charCode * Math.pow(26, i);
		}

		return result - 1;
	}

	toLetter(index: number): string {
		const base = "A".charCodeAt(0);
		let quotient = index + 1;
		let result = "";

		while (quotient > 0) {
			const remainder = (quotient - 1) % 26;
			result = String.fromCharCode(base + remainder) + result;
			quotient = Math.floor((quotient - 1) / 26);
		}

		return result;
	}

	getData() {
		return this.value ? this.value : "";
	}
}
