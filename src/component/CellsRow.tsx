import * as React from "react";
import Column from "src/services/cell/Column";
import Row from "src/services/cell/Row";
import { SelectionData } from "./hooks/useSelection";
import { Style } from "./hooks/useStyle";
import { TableData } from "./hooks/useTable";

const CellsRow: React.FC<{
	columns: Column[];
	row: Row;
	selectionData: SelectionData;
	tableData: TableData;
	style: Style;
}> = ({ columns, selectionData, tableData, style, row }) => {
	function onMouseDown(column: number) {
		selectionData.startNewSelection([column, row.index]);
	}
	function onMouseUp(column: number) {
		selectionData.endSelection([column, row.index]);
	}
	function onMouseEnter(column: number) {
		selectionData.updateSelection([column, row.index]);
	}
	function onBlur(column: number, value: string | null) {
		tableData.updateCell([column, row.index], value ? value : "");
	}

	function onContextMenu(column: number) {}
	return (
		<>
			{columns.map((column, columnIndex) => {
				const cell = tableData.getCell([columnIndex, row.index]);
				let content = "";
				let cellStyle: React.CSSProperties | undefined = undefined;
				if (cell) {
					content = cell ? cell.getCellText() : "";
					cellStyle = style.generateStyle(cell, row, column);
				}

				return (
					<td
						key={columnIndex}
						onBlur={(e) =>
							onBlur(columnIndex, e.target.textContent)
						}
						onContextMenu={() => onContextMenu(columnIndex)}
						onMouseDown={() => onMouseDown(columnIndex)}
						onMouseEnter={() => onMouseEnter(columnIndex)}
						onMouseUp={() => onMouseUp(columnIndex)}
						style={cellStyle}
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
