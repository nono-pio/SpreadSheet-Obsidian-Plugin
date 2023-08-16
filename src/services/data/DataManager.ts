import { SSView } from "src/view/SSView";
import Cell from "../cell/Cell";
import Column from "../cell/Column";
import DefaultCell from "../cell/DefaultCell";
import MenuCell from "../cell/MenuCell";
import Row from "../cell/Row";
import { fileParser, fileStringify, parserCell } from "../file/FileParser";
import { createNewSheet } from "./SpreadSheetCreator";

export const SAFE_RECURSIF = 200;

export class DataManager {
	data: SSData; // File Data

	currentSheet: number;

	view: SSView;
	menu = new MenuCell();

	constructor(view: SSView) {
		this.view = view;
	}

	// ------------------------------------------------------------------------
	// set/get Data
	setData(data: string) {
		this.currentSheet = 0;
		this.data = fileParser(data, this);
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

	insertColumn(index: number) {
		this.getSheet().table.forEach((row) => {
			row.splice(index, 0, new DefaultCell());
		});

		if (this.getColumnsLenght() > this.getMaxColumnsLenght()) {
			this.addMaxColumn();
		}
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

	insertRow(index: number) {
		this.getSheet().table.splice(
			index,
			0,
			Array.from(
				{ length: this.getColumnsLenght() },
				() => new DefaultCell()
			)
		);
		if (this.getRowsLenght() > this.getMaxRowsLenght()) {
			this.addMaxRow();
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

	setProperty(name: string, value: string) {
		this.data.properties.push(new Propertie(name, value));
	}

	setPropertyName(index: number, name: string) {
		this.data.properties[index].name = name;
	}

	setPropertyValue(index: number, value: string) {
		this.data.properties[index].value = value;
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

	changeCell(
		column: number,
		row: number,
		value: string | null,
		keepConfig = true
	) {
		const cell = this.getCell(column, row);

		if (cell) {
			const config = keepConfig ? cell.config : null;
			this.data.sheets[this.currentSheet].table[row][column] =
				value !== null && value !== ""
					? parserCell(value, config, this)
					: new DefaultCell("", config);
			return;
		}

		if (value === null || value === "") {
			return;
		}

		this.updateTable(column, row);

		this.data.sheets[this.currentSheet].table[row][column] = parserCell(
			value,
			null,
			this
		);
	}

	updateTable(column: number, row: number) {
		if (this.cellInRange(column, row)) {
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

		console.log(this.getSheet().table);
	}

	openCellMenu(
		rowIndex: number,
		colIndex: number,
		cellElement: HTMLTableCellElement | undefined
	) {
		if (cellElement) {
			const rect = cellElement.getBoundingClientRect();
			this.menu.openMenu(
				rect.x,
				rect.y + rect.height,
				rowIndex,
				colIndex,
				this
			);
		}
	}

	deleteProp(index: number) {
		this.data.properties.splice(index, 1);
	}

	// ------------------------------------------------------------------------

	cellInRange(column: number, row: number): boolean {
		return column < this.getColumnsLenght() && row < this.getRowsLenght();
	}

	// ------------------------------------------------------------------------

	getPropValue(prop: string): string | undefined {
		for (const _prop of this.data.properties) {
			if (_prop.name === prop) {
				return _prop.value;
			}
		}
		return undefined;
	}

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

	getCellConfig(
		column: number,
		row: number
	): React.CSSProperties | undefined {
		if (this.cellInRange(column, row)) {
			const cell = this.getSheet().table[row][column];
			if (cell.config) {
				return cell.config.generateStyle(this);
			} else {
				return undefined;
			}
		}

		return undefined;
	}

	getForEachCellSelection(
		selection: [number, number, number, number],
		callback: (cell: Cell | undefined, row: number, col: number) => void
	) {
		for (
			let rowIndex = selection[0];
			rowIndex <= selection[2];
			rowIndex++
		) {
			for (
				let colIndex = selection[1];
				colIndex <= selection[3];
				colIndex++
			) {
				callback(this.getCell(colIndex, rowIndex), rowIndex, colIndex);
			}
		}
	}

	getSelectionCells(selection: [number, number, number, number]) {
		const cells: (Cell | undefined)[][] = [];
		for (
			let rowIndex = selection[0];
			rowIndex <= selection[2];
			rowIndex++
		) {
			const lastIndex = cells.push([]) - 1;
			for (
				let colIndex = selection[1];
				colIndex <= selection[3];
				colIndex++
			) {
				cells[lastIndex].push(this.getCell(colIndex, rowIndex));
			}
		}
		return cells;
	}

	getColor(colorText: number): string {
		return this.data.colors[colorText];
	}

	getCell(column: number, row: number) {
		if (this.cellInRange(column, row)) {
			return this.getSheet().table[row][column];
		}
		return undefined;
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
