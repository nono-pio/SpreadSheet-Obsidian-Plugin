import React, { useMemo } from "react";
import { CellPos } from "src/services/cell/Cell";
import { Sheet } from "src/services/data/DataManager";
import CellsRow from "./CellsRow";
import Columns from "./Columns";
import RowUI from "./RowUI";
import { Selection, SelectionData, posEqual } from "./hooks/useSelection";
import { Style } from "./hooks/useStyle";
import { TableData } from "./hooks/useTable";
import Add from "./icon/Add";

const Table: React.FC<{
	tableRef: React.LegacyRef<HTMLTableElement>;
	sheet: Sheet;
	tableData: TableData;
	selectionData: SelectionData;
	style: Style;
	getCellElement: (cellPos: CellPos) => HTMLTableCellElement | undefined;
}> = ({ tableRef, sheet, tableData, selectionData, style, getCellElement }) => {
	const columns = sheet.columns;
	const rows = sheet.rows;

	const renderRows = useMemo(() => {
		console.log("renderRows");

		return sheet.rows.map((r, ri) => (
			<tr key={ri}>
				<RowUI
					row={r}
					selection={selectionData.selection}
					columnLenght={columns.length}
					setSelection={selectionData.setSelection}
				/>
				<CellsRow
					columns={columns}
					row={r}
					style={style}
					selectionData={selectionData}
					tableData={tableData}
				/>
				<td></td>
			</tr>
		));
	}, [
		rows,
		columns,
		selectionData.selection,
		selectionData.onSelectionMode,
		tableData.tableChange,
	]);

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
		<table
			ref={tableRef}
			onKeyDown={(e) =>
				keyManager(
					selectionData,
					e,
					tableData,
					columns.length,
					rows.length
				)
			}
		>
			{renderTableHead}
			<tbody>{renderRows}</tbody>
			{renderTableFoot}
		</table>
	);
};

export default Table;

async function keyManager(
	selectionData: SelectionData,
	e: React.KeyboardEvent<HTMLTableElement>,
	tableData: TableData,
	columnLenght: number,
	rowLenght: number
) {
	const selection = selectionData.selection;
	const multCellSelected = !posEqual(selection[0], selection[1]);

	/* console.groupCollapsed("Key press in table");
	console.log("key : " + e.key);
	console.log("ctrl : " + e.ctrlKey);
	console.log("multiple cells : " + multCellSelected);
	console.groupEnd(); */

	switch (e.key) {
		case "c":
			if (e.ctrlKey && multCellSelected) {
				e.preventDefault(); // cannot copy selected text (only cells)
				copy(selection, tableData);
			}
			break;
		case "v":
			if (e.ctrlKey) {
				const _pasteTable = await pasteTable();
				if (_pasteTable.length > 1 || _pasteTable[0].length > 1) {
					e.preventDefault();
					paste(selectionData.startSelection, tableData, _pasteTable);
				}
			}
			break;
		case "x":
			if (e.ctrlKey && multCellSelected) {
				e.preventDefault();
				copy(selection, tableData);
				deleteCells(selectionData, tableData);
			}
			break;
		case "a":
			if (e.ctrlKey && multCellSelected) {
				e.preventDefault();
				selectionData.setSelection(
					[0, 0],
					[tableData.columnLenght - 1, tableData.rowLenght - 1],
					true
				);
			}
			break;
		case "z":
			if (e.ctrlKey && multCellSelected) {
				e.preventDefault();
				// TODO
			}
			break;
		case "y":
			if (e.ctrlKey && multCellSelected) {
				e.preventDefault();
				// TODO
			}
			break;

		case "Delete":
			if (multCellSelected) {
				e.preventDefault();
				deleteCells(selectionData, tableData);
			}
			break;
		case "Backspace":
			if (multCellSelected) {
				e.preventDefault();
				deleteCells(selectionData, tableData);
			}
			break;

		case "Enter":
			e.preventDefault();
			// BUG getCellElement(selectionData.startSelection)?.blur();
			if (selectionData.startSelection[1] < rowLenght - 1) {
				selectionData.oneCellSelection(
					[
						selectionData.startSelection[0],
						selectionData.startSelection[1] + 1,
					],
					true
				);
			}
			break;
		case "ArrowUp":
			e.preventDefault();
			if (selectionData.startSelection[1] > 0) {
				selectionData.oneCellSelection(
					[
						selectionData.startSelection[0],
						selectionData.startSelection[1] - 1,
					],
					true
				);
			}
			break;
		case "ArrowDown":
			e.preventDefault();
			if (selectionData.startSelection[1] < rowLenght - 1) {
				selectionData.oneCellSelection(
					[
						selectionData.startSelection[0],
						selectionData.startSelection[1] + 1,
					],
					true
				);
			}
			break;
		case "ArrowLeft":
			// TODO
			break;
		case "ArrowRight":
			// TODO
			break;
		case "Tab": {
			e.preventDefault();

			let newPos = selectionData.startSelection[0];

			if (e.shiftKey) {
				if (newPos > 0) {
					newPos--;
				}
			} else {
				if (newPos < columnLenght - 1) {
					newPos++;
				}
			}

			selectionData.oneCellSelection(
				[newPos, selectionData.startSelection[1]],
				true
			);
			break;
		}
	}
}

function deleteCells(selectionData: SelectionData, tableData: TableData) {
	tableData.changeTable(); // prevent change
	selectionData.foreachSelectionCellsPos((row, column) =>
		tableData.updateCell([column, row], "", false)
	);
}

function copy(selection: Selection, tableData: TableData) {
	let string = "";
	for (let row = selection[0][1]; row <= selection[1][1]; row++) {
		for (
			let column = selection[0][0];
			column <= selection[1][0];
			column++
		) {
			string += tableData.getCellContent([column, row]);

			if (column < selection[1][0]) {
				string += "\t";
			}
		}

		if (row < selection[1][1]) {
			string += "\n";
		}
	}

	navigator.clipboard.writeText(string);
}

async function pasteTable() {
	const text = await navigator.clipboard.readText();
	return text.split("\n").map((v) => v.split("\t"));
}

async function paste(
	selectionStart: CellPos,
	tableData: TableData,
	pasteTable: string[][]
) {
	tableData.changeTable(); // prevent change

	pasteTable.forEach((row, rowIndex) =>
		row.forEach((cell, columnIndex) =>
			tableData.updateCell(
				[columnIndex + selectionStart[0], rowIndex + selectionStart[1]],
				cell,
				false
			)
		)
	);
}
