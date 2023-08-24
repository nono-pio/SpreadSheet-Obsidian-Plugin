import * as React from "react";
import Row from "../services/cell/Row";
import { Selection, SetSelection } from "./hooks/useSelection";

const RowUI: React.FC<{
	row: Row;
	rowIndex: number;
	selection: Selection;
	columnLenght: number;
	setSelection: SetSelection;
}> = ({ row, rowIndex, selection, columnLenght, setSelection }) => {
	return (
		<th
			key={rowIndex}
			className={
				rowIndex >= selection[0][1] && rowIndex <= selection[1][1]
					? "active"
					: ""
			}
			onClick={() =>
				setSelection([0, rowIndex], [columnLenght, rowIndex], true)
			}
		>
			{row.getText(rowIndex)}
		</th>
	);
};

export default RowUI;
