import CellManager from "../cell/CellManager";

export abstract class Node {
	abstract getString(): string;
	getNumber() {
		return parseFloat(this.getString());
	}
	getBoolean() {
		return this.getString() === "true";
	}
}

export class NopNode extends Node {
	getString(): string {
		return "Error";
	}
}

export class LinkCell extends Node {
	row: number;
	column: number;
	constructor(column: number, row: number) {
		super();
		this.column = column;
		this.row = row;
	}
	getString(): string {
		return CellManager.instance.getCellValue(this.column, this.row);
	}
}

export class Binary extends Node {
	a: Node;
	b: Node;
	calc: (a: number, b: number) => number;
	constructor(a: Node, b: Node, calc: (a: number, b: number) => number) {
		super();
		this.a = a;
		this.b = b;
		this.calc = calc;
	}
	getString(): string {
		return this.calc(this.a.getNumber(), this.b.getNumber()).toString();
	}
	getNumber(): number {
		return this.calc(this.a.getNumber(), this.b.getNumber());
	}
}

export class Num extends Node {
	num: number;
	constructor(num: number) {
		super();
		this.num = num;
	}
	getString(): string {
		return this.num.toString();
	}
	getNumber(): number {
		return this.num;
	}
}

export class Prop extends Node {
	propValue: string;
	constructor(propValue: string) {
		super();
		this.propValue = propValue;
	}
	getString(): string {
		return this.propValue;
	}
}

export class Str extends Node {
	str: string;
	constructor(str: string) {
		super();
		this.str = str;
	}
	getString(): string {
		return this.str;
	}
}

export class Func extends Node {
	para: Node[];
	func: (nodes: Node[]) => Node;
	constructor(func: (nodes: Node[]) => Node, para: Node[]) {
		super();
		this.func = func;
		this.para = para;
	}
	getString(): string {
		return this.func(this.para).getString();
	}
}
