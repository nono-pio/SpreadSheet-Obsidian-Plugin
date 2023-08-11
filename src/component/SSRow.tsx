import * as React from "react";
import Column from "src/services/cell/Column";
import { TableProps } from "./SSTable";
import { TableData } from "./hooks/useTableData";

interface RowProps extends TableProps {
	columns: Column[];
	rowIndex: number;
	select: (
		selection: [number, number, number, number],
		data: Partial<TableData>
	) => void;
}
const SSRow = ({
	columns,
	rowIndex,
	dataManager,
	tableData,
	setTableData,
	select,
}: RowProps) => {
	const cell = (colIndex: number) => (
		<th
			key={colIndex}
			onMouseDown={() => handleMouseDown(colIndex)}
			onMouseUp={handleMouseUp}
			onMouseEnter={() => handleMouseEnter(colIndex)}
			onDoubleClick={() => handleDoubleClick(colIndex)}
		>
			{dataManager.getCellText(colIndex, rowIndex)}
		</th>
	);

	const activeCell = (colIndex: number) => (
		<th
			key={colIndex}
			contentEditable
			suppressContentEditableWarning
			onMouseDown={() => handleMouseDown(colIndex)}
			onMouseUp={handleMouseUp}
			onMouseEnter={() => handleMouseEnter(colIndex)}
			onBlur={(e) => {
				dataManager.changeCell(
					colIndex,
					rowIndex,
					e.target.textContent
				);
				setTableData({ activeCell: [-1, -1] });
			}}
		>
			{dataManager.getCellTextEnter(colIndex, rowIndex)}
		</th>
	);

	function handleMouseDown(colIndex: number) {
		select([rowIndex, colIndex, rowIndex, colIndex], {
			startSelection: [rowIndex, colIndex],
		});
	}

	function handleMouseEnter(colIndex: number) {
		if (tableData.mousePress) {
			select(setOderSelection(colIndex), {});
		}
	}

	function handleMouseUp() {
		setTableData({ mousePress: false });
	}

	function handleDoubleClick(colIndex: number) {
		setTableData({ activeCell: [rowIndex, colIndex] });
	}

	function setOderSelection(colIndex: number) {
		const selection: [number, number, number, number] = [
			...tableData.startSelection,
			rowIndex,
			colIndex,
		];

		if (selection[0] > selection[2]) {
			const tmp = selection[0];
			selection[0] = selection[2];
			selection[2] = tmp;
		}
		if (selection[1] > selection[3]) {
			const tmp = selection[1];
			selection[1] = selection[3];
			selection[3] = tmp;
		}

		return selection;
	}

	return (
		<>
			{columns.map((_, colIndex) => {
				if (
					rowIndex === tableData.activeCell[0] &&
					colIndex === tableData.activeCell[1]
				) {
					return activeCell(colIndex);
				} else {
					return cell(colIndex);
				}
			})}
		</>
	);
};

export default SSRow;