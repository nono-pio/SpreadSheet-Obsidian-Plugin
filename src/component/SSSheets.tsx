import * as React from "react";
import { TableProps } from "./SSTable";

const Sheets = ({ dataManager, tableData, setTableData }: TableProps) => {
	return (
		<div className="sheets">
			<ul>
				{dataManager.getSheets().map((sheet, index) => (
					<li
						key={index}
						onClick={() => dataManager.changeSheet(index)}
						className={`${
							dataManager.currentSheet === index
								? "sheet-active"
								: ""
						}`}
						onMouseEnter={(e) =>
							e.currentTarget.addClass("sheet-hover")
						}
						onMouseOut={(e) =>
							e.currentTarget.removeClass("sheet-hover")
						}
						contentEditable
						suppressContentEditableWarning
						onBlur={(e) =>
							dataManager.changeSheetName(
								index,
								e.target.getText()
							)
						}
					>
						{sheet.name}
					</li>
				))}
			</ul>
			<button
				onClick={() => {
					dataManager.addSheet();
				}}
			>
				Add Sheet
			</button>
		</div>
	);
};

export default Sheets;
