import { Node } from "../formula/FormulaParser";
import Cell from "./Cell";
import CellConfig from "./CellConfig";

export default class FormulaCell extends Cell {
	formula: string;
	node: Node;
	result: string | undefined = undefined;

	constructor(formula: string, node: Node, config: CellConfig | null) {
		super(config);
		this.formula = formula;
		this.node = node;
	}

	getCellText(): string {
		if (!this.result) {
			this.result = this.node.getString();
		}
		return this.result;
	}

	getCellTextEnter(): string {
		return this.formula;
	}

	getData(): string {
		return this.formula;
	}
}
