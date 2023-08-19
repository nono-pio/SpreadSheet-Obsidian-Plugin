import * as React from "react";
import { SheetsData } from "./hooks/useSheetsData";

const Sheets: React.FC<{ sheetsData: SheetsData }> = ({ sheetsData }) => {
	return (
		<div className="sheets">
			{sheetsData.sheets.map((sheet, index) => (
				<button
					key={index}
					className={
						index === sheetsData.currentSheetIndex
							? "active sheet-btn"
							: "sheet-btn"
					}
					onBlur={(e) =>
						sheetsData.renameSheet(
							index,
							e.target.textContent
								? e.target.textContent
								: "error"
						)
					}
					onClick={() => {
						if (index !== sheetsData.currentSheetIndex)
							sheetsData.changeSheet(index);
					}}
					contentEditable
					suppressContentEditableWarning
				>
					{sheet.name}
				</button>
			))}
			<button onClick={() => sheetsData.addSheet()}>Add Sheet</button>
		</div>
	);
};

export default Sheets;
