import * as React from "react";
import { CellPos } from "src/services/cell/Cell";
import { Selection } from "./hooks/useSelection";

const Selection: React.FC<{
	getCellElement: (pos: CellPos) => HTMLTableCellElement | undefined;
	selection: Selection;
}> = React.memo(
	({ getCellElement, selection }) => {
		console.log("Render Selection");

		const topLeftCell = getCellElement(selection[0]);
		const bottomRightCell = getCellElement(selection[1]);

		let top: number | undefined = undefined;
		let left: number | undefined = undefined;
		let height: number | undefined = undefined;
		let width: number | undefined = undefined;
		if (topLeftCell && bottomRightCell) {
			top = topLeftCell.offsetTop;
			left = topLeftCell.offsetLeft;
			height =
				bottomRightCell.offsetTop + bottomRightCell.offsetHeight - top;
			width =
				bottomRightCell.offsetLeft + bottomRightCell.offsetWidth - left;
		}
		return (
			<div
				className="selection"
				style={{
					top,
					left,
					height,
					width,
				}}
			/>
		);
	},
	(prev, next) => selectionEqual(prev.selection, next.selection)
);

export default Selection;

function selectionEqual(selectionPrev: Selection, selectionNext: Selection) {
	return (
		posEqual(selectionPrev[0], selectionNext[0]) &&
		posEqual(selectionPrev[1], selectionNext[1])
	);
}

function posEqual(pos1: CellPos, pos2: CellPos) {
	return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}
