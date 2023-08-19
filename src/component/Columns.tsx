import * as React from "react";
import Column from "../services/cell/Column";
import { Selection, SetSelection } from "./hooks/useSelection";

const Columns: React.FC<{
	columns: Column[];
	selection: Selection;
	rowLenght: number;
	setSelection: SetSelection;
}> = ({ columns, rowLenght, selection, setSelection }) => {
	return (
		<>
			{columns.map((column, columnIndex) => (
				<th
					key={columnIndex}
					className={
						selection &&
						columnIndex >= selection[0][0] &&
						columnIndex <= selection[1][0]
							? "active"
							: ""
					}
					onClick={() =>
						setSelection(
							[columnIndex, 0],
							[columnIndex, rowLenght],
							true
						)
					}
				>
					{column.getText(columnIndex)}
				</th>
			))}
		</>
	);
};

export default Columns;
