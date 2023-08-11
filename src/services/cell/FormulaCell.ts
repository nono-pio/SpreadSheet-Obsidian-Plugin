import Formula from "../formula/Formula";
import Cell from "./Cell";
import CellConfig from "./CellConfig";

export default class FormulaCell extends Cell {
	formulaString: string;
	formula: Formula<unknown>;
	result: unknown | null = null;

	constructor(
		formula: Formula<unknown>,
		formulaString: string,
		config: CellConfig | null
	) {
		super(config);
		this.formula = formula;
		this.formulaString = formulaString;
	}

	getCellText(): string {
		if (this.result === null) {
			this.result = this.makeFormula();
		}
		return "" + this.result;
	}

	getCellTextEnter(): string {
		return this.formulaString;
	}

	makeFormula(): unknown {
		return this.formula.GetValue();
	}

	getData(): string {
		return this.formulaString;
	}
}
