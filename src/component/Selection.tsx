import * as React from "react";
import { CellPos } from "src/services/cell/Cell";
import useSelection from "./hooks/useSelection";

const Selection: React.FC<{
	getCellElement: (pos: CellPos) => HTMLTableCellElement | undefined;
}> = ({ getCellElement }) => {
	console.log("Render Selection");

	const { selection } = useSelection();

	let style: React.CSSProperties | undefined = undefined;
	if (selection) {
		const topLeftCell = getCellElement(selection[0]);
		const bottomRightCell = getCellElement(selection[1]);

		if (topLeftCell && bottomRightCell) {
			const top = topLeftCell.offsetTop;
			const left = topLeftCell.offsetLeft;
			const bottom =
				bottomRightCell.offsetTop + bottomRightCell.offsetHeight;
			const right =
				bottomRightCell.offsetLeft + bottomRightCell.offsetWidth;

			style = {
				backgroundColor: "red",
				position: "absolute",
				top: top,
				left: left,
				bottom: bottom,
				right: right,
			};
		}
	}

	return <div className="selection" style={style} />;
};

export default Selection;
