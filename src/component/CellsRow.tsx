import * as React from "react";
import Column from "src/services/cell/Column";
import { SelectionData } from "./hooks/useSelection";
import { TableData } from "./hooks/useTable";

const CellsRow: React.FC<{
	columns: Column[];
	row: number;
	selectionData: SelectionData;
	tableData: TableData;
}> = ({ columns, row, selectionData, tableData }) => {
	function onMouseDown(column: number) {
		selectionData.startNewSelection([column, row]);
	}
	function onMouseUp(column: number) {
		selectionData.endSelection([column, row]);
	}
	function onMouseEnter(column: number) {
		if (selectionData.onSelectionMode) {
			selectionData.updateSelection([column, row]);
		}
	}
	function onBlur(column: number, value: string | null) {
		tableData.updateCell([column, row], value ? value : "");
	}

	function onContextMenu(column: number) {}

	return (
		<>
			{columns.map((_, column) => {
				const cell = tableData.getCell([column, row]);
				const content = cell ? cell.getCellText() : "";
				const style =
					cell && cell.config
						? cell.config.generateStyle()
						: undefined;

				return (
					<td
						key={column}
						onBlur={(e) => onBlur(column, e.target.textContent)}
						onContextMenu={() => onContextMenu(column)}
						onMouseDown={() => onMouseDown(column)}
						onMouseEnter={() => onMouseEnter(column)}
						onMouseUp={() => onMouseUp(column)}
						style={style}
						contentEditable="true"
						suppressContentEditableWarning
					>
						{content}
					</td>
				);
			})}
		</>
	);
};

export default CellsRow;
