import * as React from "react";
import { Sheet } from "src/services/data/DataManager";
import CellsRow from "./CellsRow";
import Columns from "./Columns";
import RowUI from "./RowUI";
import { SelectionData } from "./hooks/useSelection";
import { TableData } from "./hooks/useTable";
import Add from "./icon/Add";

const Table: React.FC<{
	tableRef: React.LegacyRef<HTMLTableElement>;
	sheet: Sheet;
	tableData: TableData;
	selectionData: SelectionData;
}> = ({ tableRef, sheet, tableData, selectionData }) => {
	console.log("Render Table");

	const columns = sheet.columns;
	const rows = sheet.rows;

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
						<CellsRow
							columns={sheet.columns}
							row={ri}
							selectionData={selectionData}
							tableData={tableData}
						/>
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
