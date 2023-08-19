import Cell, { CellPos } from "src/services/cell/Cell";
import Column from "src/services/cell/Column";
import Row from "src/services/cell/Row";
import { Sheet } from "src/services/data/DataManager";
import { parserCell } from "src/services/file/FileParser";

const useTable: (sheet: Sheet) => TableData = (sheet) => {
	function addMaxColumn() {
		sheet.columns.push(new Column());
	}

	function addMaxRow() {
		sheet.rows.push(new Row());
	}

	function updateCell(pos: CellPos, newValue: string, keepConfig = true) {
		const oldCell = sheet.table[pos[1]][pos[0]];
		sheet.table[pos[1]][pos[0]] = parserCell(
			newValue,
			keepConfig ? oldCell.config : null
		);
	}

	function getCell(pos: CellPos) {
		return sheet.table[pos[1]][pos[0]];
	}

	return {
		addMaxColumn,
		addMaxRow,
		updateCell,
		getCell,
	};
};

export default useTable;

export interface TableData {
	addMaxColumn: () => void;
	addMaxRow: () => void;
	updateCell: (pos: CellPos, newValue: string, keepConfig?: boolean) => void;
	getCell: (pos: CellPos) => Cell;
}
