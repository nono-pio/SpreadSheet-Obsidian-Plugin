import * as React from "react";
import Column from "src/services/cell/Column";
import Row from "src/services/cell/Row";
import { SelectionData } from "./hooks/useSelection";
import { Style } from "./hooks/useStyle";
import { TableData } from "./hooks/useTable";

const CellsRow: React.FC<{
	columns: Column[];
	rowIndex: number;
	row: Row;
	selectionData: SelectionData;
	tableData: TableData;
	style: Style;
}> = ({ columns, rowIndex, selectionData, tableData, style, row }) => {
	function onMouseDown(column: number) {
		selectionData.startNewSelection([column, rowIndex]);
	}
	function onMouseUp(column: number) {
		selectionData.endSelection([column, rowIndex]);
	}
	function onMouseEnter(column: number) {
		if (selectionData.onSelectionMode) {
			selectionData.updateSelection([column, rowIndex]);
		}
	}
	function onBlur(column: number, value: string | null) {
		tableData.updateCell([column, rowIndex], value ? value : "");
	}

	function onContextMenu(column: number) {}
	return (
		<>
			{columns.map((column, columnIndex) => {
				const cell = tableData.getCell([columnIndex, rowIndex]);
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
						onKeyDown={(e) => console.log(e.key)}
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
