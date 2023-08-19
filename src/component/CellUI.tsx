import * as React from "react";

const CellUI: React.FC<{
	rowIndex: number;
	columnIndex: number;
	onMouseDown: ActionOnCell;
	onMouseUp: ActionOnCell;
	onMouseEnter: ActionOnCell;
	onContextMenu: ActionOnCell;
	onBlur: (column: number, row: number, value: string | null) => void;
}> = ({
	rowIndex,
	columnIndex,
	onBlur,
	onContextMenu,
	onMouseDown,
	onMouseEnter,
	onMouseUp,
}) => {
	return (
		<td
			onMouseDown={() => onMouseDown(columnIndex, rowIndex)}
			onMouseUp={() => onMouseUp(columnIndex, rowIndex)}
			onMouseEnter={() => onMouseEnter(columnIndex, rowIndex)}
			onContextMenu={() => onContextMenu(columnIndex, rowIndex)}
			onBlur={(e) => onBlur(columnIndex, rowIndex, e.target.textContent)}
			contentEditable="true"
			suppressContentEditableWarning
		>{`${columnIndex}-${rowIndex}`}</td>
	);
};

export default CellUI;

type ActionOnCell = (column: number, row: number) => void;
