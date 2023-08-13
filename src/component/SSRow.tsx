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
	getCellElement: (
		row: number,
		col: number
	) => HTMLTableCellElement | undefined;
}
const SSRow = ({
	columns,
	rowIndex,
	dataManager,
	tableData,
	setTableData,
	select,
	getCellElement,
}: RowProps) => {
	const cell = (colIndex: number, style: React.CSSProperties | undefined) => (
		<th
			key={colIndex}
			style={style}
			onMouseDown={() => handleMouseDown(colIndex)}
			onMouseUp={handleMouseUp}
			onMouseEnter={() => handleMouseEnter(colIndex)}
			onDoubleClick={() => handleDoubleClick(colIndex)}
			onContextMenu={() => handleRightClick(colIndex)}
		>
			{dataManager.getCellText(colIndex, rowIndex)}
		</th>
	);

	const activeCell = (
		colIndex: number,
		style: React.CSSProperties | undefined
	) => (
		<th
			key={colIndex}
			style={style}
			contentEditable
			suppressContentEditableWarning
			onMouseDown={() => handleMouseDown(colIndex)}
			onMouseUp={handleMouseUp}
			onMouseEnter={() => handleMouseEnter(colIndex)}
			onContextMenu={() => handleRightClick(colIndex)}
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

	function handleRightClick(colIndex: number) {
		dataManager.openCellMenu(
			rowIndex,
			colIndex,
			getCellElement(rowIndex, colIndex)
		);
		setTableData({ needUpdate: true });
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
				const style = dataManager.getCellConfig(colIndex, rowIndex);
				if (
					rowIndex === tableData.activeCell[0] &&
					colIndex === tableData.activeCell[1]
				) {
					return activeCell(colIndex, style);
				} else {
					return cell(colIndex, style);
				}
			})}
		</>
	);
};

export default SSRow;
