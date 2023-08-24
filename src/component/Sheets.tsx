import React, { FC } from "react";
import { SheetsData } from "./hooks/useSheetsData";

interface SheetsProps {
	sheetsData: SheetsData;
}

const Sheets: FC<SheetsProps> = ({ sheetsData }) => {
	const handleButtonClick = (index: number) => {
		if (index !== sheetsData.currentSheetIndex) {
			sheetsData.changeSheet(index);
		}
	};

	const handleBlur = (index: number, newName: string | null) => {
		sheetsData.renameSheet(index, newName || "error");
	};

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
					onBlur={(e) => handleBlur(index, e.target.textContent)}
					onClick={() => handleButtonClick(index)}
					contentEditable
					suppressContentEditableWarning
				>
					{sheet.name}
				</button>
			))}
			<button onClick={sheetsData.addSheet}>Add Sheet</button>
		</div>
	);
};

export default Sheets;
