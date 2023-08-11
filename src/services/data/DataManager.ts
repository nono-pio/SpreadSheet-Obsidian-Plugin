import { SSView } from "src/view/SSView";
import Cell from "../cell/Cell";
import Column from "../cell/Column";
import DefaultCell from "../cell/DefaultCell";
import Row from "../cell/Row";
import { fileParser, fileStringify, parserCell } from "../file/FileParser";
import { createNewSheet } from "./SpreadSheetCreator";

export const SAFE_RECURSIF = 200;

export class DataManager {
	data: SSData; // File Data

	currentSheet: number;

	view: SSView;

	constructor(view: SSView) {
		this.view = view;
	}

	// ------------------------------------------------------------------------
	// set/get Data
	setData(data: string) {
		this.currentSheet = 0;
		this.data = fileParser(data);
	}

	getDataJSON() {
		return fileStringify(this.data);
	}

	// ------------------------------------------------------------------------

	addSheet() {
		const newLenght = this.data.sheets.push(createNewSheet("untited"));
		this.changeSheet(newLenght - 1);
	}

	private addColumns(nbCol: number) {
		this.getSheet().table.forEach((row) => {
			for (let index = 0; index < nbCol; index++) {
				row.push(new DefaultCell());
			}
		});
	}

	addMaxColumn() {
		this.data.sheets[this.currentSheet].columns.push(new Column());
		this.view.reloadTable();
	}

	private addRows(nbRow: number) {
		for (let index = 0; index < nbRow; index++) {
			this.getSheet().table.push(
				Array.from(
					{ length: this.getColumnsLenght() },
					() => new DefaultCell()
				)
			);
		}
	}

	addMaxRow() {
		this.data.sheets[this.currentSheet].rows.push(new Row());
		this.view.reloadTable();
	}

	// return index of the color
	addColor(color: string): number {
		for (let index = 0; index < this.data.colors.length; index++) {
			if (this.data.colors[index] === color) {
				return index;
			}
		}

		return this.data.colors.push(color) - 1;
	}

	// ------------------------------------------------------------------------

	changeSheet(index: number) {
		if (index === this.currentSheet) {
			return;
		}
		this.currentSheet = index;
		this.view.reloadTable();
	}

	changeSheetName(index: number, name: string) {
		this.data.sheets[index].name = name;
	}

	changeCell(column: number, row: number, value: string | null) {
		if (this.cellInRange(column, row)) {
			const cell = this.getCell(column, row);
			this.data.sheets[this.currentSheet].table[row][column] = value
				? parserCell(value, cell.config)
				: new DefaultCell();
			return;
		}

		if (value === null || value === "") {
			return;
		}

		const difCol = column + 1 - this.getColumnsLenght();
		if (difCol > 0) {
			this.addColumns(difCol);
		}

		const difRow = row + 1 - this.getRowsLenght();
		if (difRow > 0) {
			this.addRows(difRow);
		}

		this.data.sheets[this.currentSheet].table[row][column] = parserCell(
			value,
			null
		);

		console.log(this.getSheet().table);
	}

	// ------------------------------------------------------------------------

	cellInRange(column: number, row: number): boolean {
		return column < this.getColumnsLenght() && row < this.getRowsLenght();
	}

	// ------------------------------------------------------------------------

	getCellText(column: number, row: number): string {
		if (this.cellInRange(column, row)) {
			return this.getSheet().table[row][column].getCellText();
		}

		return "";
	}

	getCellTextEnter(column: number, row: number): string {
		if (this.cellInRange(column, row)) {
			return this.getSheet().table[row][column].getCellTextEnter();
		}

		return "";
	}

	getCell(column: number, row: number) {
		return this.getSheet().table[row][column];
	}

	getData() {
		return this.data;
	}

	getSheet() {
		return this.data.sheets[this.currentSheet];
	}

	getSheets() {
		return this.data.sheets;
	}

	getColumnsLenght() {
		return this.getSheet().table[0].length;
	}

	getMaxColumnsLenght() {
		return this.getSheet().columns.length;
	}

	getRowsLenght() {
		return this.getSheet().table.length;
	}

	getMaxRowsLenght() {
		return this.getSheet().rows.length;
	}
}

export class SSData {
	sheets: Sheet[];
	properties: Propertie[];
	colors: string[];

	constructor(sheets: Sheet[], properties: Propertie[], colors: string[]) {
		this.sheets = sheets;
		this.properties = properties;
		this.colors = colors;
	}
}

export class Propertie {
	name: string;
	value: string;

	constructor(name: string, value: string) {
		this.name = name;
		this.value = value;
	}
}

export class Sheet {
	name: string;
	table: Cell[][];
	columns: Column[];
	rows: Row[];

	constructor(name: string, table: Cell[][], columns: Column[], rows: Row[]) {
		this.table = table;
		this.name = name;
		this.columns = columns;
		this.rows = rows;
	}
}

export class CellData {
	row: number;
	column: number;
	cell: Cell | undefined;
}
