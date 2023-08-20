import { useState } from "react";
import CellManager from "src/services/cell/CellManager";
import { SSData, Sheet } from "src/services/data/DataManager";
import { createNewSheet } from "src/services/data/SpreadSheetCreator";

const useSheetsData: (data: SSData) => SheetsData = (data) => {
	const [currentSheet, setCurrentSheet] = useState<number>(0);

	function changeSheet(indexSheet: number) {
		setCurrentSheet(indexSheet);
		CellManager.instance.setSheet(data.sheets[currentSheet]);
	}

	function addSheet() {
		const newSheet = createNewSheet("untilted");
		const lastIndex = data.sheets.push(newSheet) - 1;
		changeSheet(lastIndex);
	}

	function renameSheet(indexSheet: number, newName: string) {
		data.sheets[indexSheet].name = newName;
	}

	return {
		sheets: data.sheets,
		currentSheetIndex: currentSheet,
		currentSheet: data.sheets[currentSheet],
		addSheet,
		renameSheet,
		changeSheet,
	};
};

export default useSheetsData;

export interface SheetsData {
	sheets: Sheet[];
	currentSheetIndex: number;
	currentSheet: Sheet;
	addSheet: () => void;
	renameSheet: (indexSheet: number, newName: string) => void;
	changeSheet: (indexSheet: number) => void;
}
