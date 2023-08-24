import React, { useMemo } from "react";
import { Sheet } from "src/services/data/DataManager";
import CellsRow from "./CellsRow";
import Columns from "./Columns";
import RowUI from "./RowUI";
import { SelectionData } from "./hooks/useSelection";
import { Style } from "./hooks/useStyle";
import { TableData } from "./hooks/useTable";
import Add from "./icon/Add";

const Table: React.FC<{
	tableRef: React.LegacyRef<HTMLTableElement>;
	sheet: Sheet;
	tableData: TableData;
	selectionData: SelectionData;
	style: Style;
}> = ({ tableRef, sheet, tableData, selectionData, style }) => {
	console.log("Render Table");

	const columns = sheet.columns;
	const rows = sheet.rows;

	const renderRows = useMemo(() => {
		console.log("renderRows");

		return sheet.rows.map((r, ri) => (
			<tr key={ri}>
				<RowUI
					row={r}
					rowIndex={ri}
					selection={selectionData.selection}
					columnLenght={columns.length}
					setSelection={selectionData.setSelection}
				/>
				<CellsRow
					columns={columns}
					rowIndex={ri}
					row={r}
					style={style}
					selectionData={selectionData}
					tableData={tableData}
				/>
				<td></td>
			</tr>
		));
	}, [rows, columns, selectionData.selection]);

	const handleAddMaxRow = () => {
		tableData.changeTable();
		tableData.addMaxRow();
	};

	const renderTableHead = (
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
	);

	const renderTableFoot = useMemo(
		() => (
			<tfoot>
				<tr>
					<th key={-1} onClick={handleAddMaxRow}>
						<Add />
					</th>
					{columns.map((_, i) => (
						<td key={i}></td>
					))}
					<td key={-2}></td>
				</tr>
			</tfoot>
		),
		[columns]
	);

	return (
		<table ref={tableRef} onKeyDown={(e) => console.log(e.key)}>
			{renderTableHead}
			<tbody>{renderRows}</tbody>
			{renderTableFoot}
		</table>
	);
};

export default Table;
