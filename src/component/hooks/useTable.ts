import { useState } from "react";
import Cell, { CellPos } from "src/services/cell/Cell";
import Column from "src/services/cell/Column";
import DefaultCell from "src/services/cell/DefaultCell";
import Row from "src/services/cell/Row";
import { Sheet } from "src/services/data/DataManager";
import { parserCell } from "src/services/file/FileParser";

const useTable: (sheet: Sheet) => TableData = (sheet) => {
	const [tableChange, setChangeTable] = useState<boolean>(false);

	function changeTable() {
		setChangeTable(true);
	}

	function resetTableChange() {
		setChangeTable(false);
	}

	function rowsLenght() {
		return sheet.table.length;
	}
	function columnsLenght() {
		return sheet.table[0].length;
	}

	function updateTable(pos: CellPos) {
		let rowChange = false;
		const rowDif = pos[1] - rowsLenght() + 1;

		if (rowDif > 0) {
			addRows(rowDif);
			rowChange = true;
		}

		let columnChange = false;
		const columnDif = pos[0] - columnsLenght() + 1;

		if (columnDif > 0) {
			addColumns(columnDif);
			columnChange = true;
		}

		if (rowChange || columnChange) {
			console.log(sheet.table);
		}
	}

	function addRows(nbRow: number) {
		for (let index = 0; index < nbRow; index++) {
			sheet.table.push(
				Array.from({ length: columnsLenght() }, () => new DefaultCell())
			);
		}
	}

	function addColumns(nbColumns: number) {
		sheet.table.forEach((row) => {
			for (let index = 0; index < nbColumns; index++) {
				row.push(new DefaultCell());
			}
		});
	}

	function addMaxColumn() {
		changeTable();
		sheet.columns.push(new Column());
	}

	function addMaxRow() {
		changeTable();
		sheet.rows.push(new Row());
	}

	function updateCell(pos: CellPos, newValue: string, keepConfig = true) {
		const oldCell = getCell(pos);

		if (oldCell && newValue !== oldCell.getData()) {
			console.log("update Table");
			sheet.table[pos[1]][pos[0]] = parserCell(
				// return default/formula cell
				newValue,
				keepConfig ? oldCell.config : null
			);
		} else if (!oldCell && newValue !== "") {
			console.log("update Table with expend");

			updateTable(pos); // expend table to cell needed
			sheet.table[pos[1]][pos[0]] = parserCell(newValue, null);
		}
	}

	function getCell(pos: CellPos): Cell | undefined {
		return sheet.table[pos[1]]?.[pos[0]];
	}

	function getCellContent(pos: CellPos) {
		const cell = getCell(pos);
		return cell ? cell.getCellText() : "";
	}

	return {
		addMaxColumn,
		addMaxRow,
		updateCell,
		getCell,
		getCellContent,
		tableChange,
		changeTable,
		resetTableChange,
	};
};

export default useTable;

export interface TableData {
	addMaxColumn: () => void;
	addMaxRow: () => void;
	updateCell: (pos: CellPos, newValue: string, keepConfig?: boolean) => void;
	getCell: (pos: CellPos) => Cell | undefined;
	getCellContent: (pos: CellPos) => string;
	tableChange: boolean;
	changeTable: () => void;
	resetTableChange: () => void;
}
