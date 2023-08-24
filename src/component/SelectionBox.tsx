import React, { FC, memo } from "react";
import { CellPos } from "src/services/cell/Cell";
import { Selection, selectionEqual } from "./hooks/useSelection";

const SelectionBox: FC<{
	getCellElement: (pos: CellPos) => HTMLTableCellElement | undefined;
	selection: Selection;
}> = memo(
	({ getCellElement, selection }) => {
		const [startPos, endPos] = selection;
		const startCell = getCellElement(startPos);
		const endCell = getCellElement(endPos);

		const selectionTop = startCell?.offsetTop || 0;
		const selectionLeft = startCell?.offsetLeft || 0;
		const selectionHeight = endCell
			? endCell.offsetTop + endCell.offsetHeight - selectionTop
			: 0;
		const selectionWidth = endCell
			? endCell.offsetLeft + endCell.offsetWidth - selectionLeft
			: 0;

		const selectionStyle = {
			top: selectionTop,
			left: selectionLeft,
			height: selectionHeight,
			width: selectionWidth,
		};

		return (
			<>
				{startCell && endCell && (
					<div className="selection" style={selectionStyle} />
				)}
			</>
		);
	},
	(prevProps, nextProps) =>
		selectionEqual(prevProps.selection, nextProps.selection)
);

export default SelectionBox;
