import * as React from "react";
import { Sheet } from "src/services/data/DataManager";
import CellUI from "./CellUI";
import Columns from "./Columns";
import RowUI from "./RowUI";
import useSelection from "./hooks/useSelection";
import { TableData } from "./hooks/useTable";
import Add from "./icon/Add";

const Table: React.FC<{
	tableRef: React.LegacyRef<HTMLTableElement>;
	sheet: Sheet;
	tableData: TableData;
}> = ({ tableRef, sheet, tableData }) => {
	console.log("Render Table");

	const columns = sheet.columns;
	const rows = sheet.rows;

	const selectionData = useSelection();

	function onMouseDown(column: number, row: number) {
		// start selection
		selectionData.startNewSelection([column, row]);
	}
	function onMouseUp(column: number, row: number) {
		// end selection
		selectionData.endSelection([column, row]);
	}
	function onMouseEnter(column: number, row: number) {
		// update selection
		selectionData.updateSelection([column, row]);
	}
	function onContextMenu(column: number, row: number) {
		// set context menu
	}
	function onBlur(column: number, row: number, value: string | null) {
		// update cell
		tableData.updateCell([column, row], value ? value : "");
	}

	return (
		<table ref={tableRef}>
			<thead>
				<tr>
					<th>/</th>
					<Columns
						columns={columns}
						rowLenght={rows.length}
						selection={selectionData.selection}
						setSelection={selectionData.setSelection}
					/>
					<th onClick={tableData.addMaxColumn}>
						<Add />
					</th>
				</tr>
			</thead>
			<tbody>
				{sheet.rows.map((r, ri) => (
					<tr key={ri}>
						<RowUI
							row={r}
							rowIndex={ri}
							selection={selectionData.selection}
							columnLenght={columns.length}
							setSelection={selectionData.setSelection}
						/>
						{sheet.columns.map((_, ci) => (
							<CellUI
								rowIndex={ri}
								columnIndex={ci}
								key={ci}
								onBlur={onBlur}
								onContextMenu={onContextMenu}
								onMouseDown={onMouseDown}
								onMouseEnter={onMouseEnter}
								onMouseUp={onMouseUp}
							/>
						))}
						<td></td>
					</tr>
				))}
			</tbody>
			<tfoot>
				<tr>
					<th key={-1} onClick={tableData.addMaxRow}>
						<Add />
					</th>
					{columns.map((_, i) => (
						<td key={i}></td>
					))}
					<td key={-2}></td>
				</tr>
			</tfoot>
		</table>
	);
};

export default Table;
