import * as React from "react";
import Row from "../services/cell/Row";
import { Selection, SetSelection } from "./hooks/useSelection";

const RowUI: React.FC<{
	row: Row;
	selection: Selection;
	columnLenght: number;
	setSelection: SetSelection;
}> = ({ row, selection, columnLenght, setSelection }) => {
	return (
		<th
			key={row.index}
			className={
				row.index >= selection[0][1] && row.index <= selection[1][1]
					? "active"
					: ""
			}
			onClick={() =>
				setSelection([0, row.index], [columnLenght, row.index], true)
			}
		>
			{row.getText()}
		</th>
	);
};

export default RowUI;
