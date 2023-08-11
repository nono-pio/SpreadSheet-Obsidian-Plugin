import Formula from "./Formula";

export default class NumberFormula extends Formula<number> {
	value: number;

	constructor(value: number) {
		super();
		this.value = value;
	}

	GetValue(): number {
		return this.value;
	}
}
