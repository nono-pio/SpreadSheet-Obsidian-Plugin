import { useState } from "react";
import { DataManager, Sheet } from "src/services/data/DataManager";

const useSheetsData: (dataManager: DataManager) => SheetsData = (
	dataManager: DataManager
) => {
	const [sheets, setSheets] = useState<Sheet[]>(dataManager.data.sheets);

	const [currentSheet, setCurrentSheet] = useState<number>(0);

	function changeSheet(indexSheet: number) {
		setCurrentSheet(indexSheet);
	}

	function addSheet() {
		const lastIndex = dataManager.addSheet(); // add new sheet to backend
		const newSheet = dataManager.getSheets()[lastIndex];
		if (newSheet) {
			setSheets([...sheets, newSheet]); // add the new sheet frontend
			changeSheet(lastIndex); //set new sheet as current
		}
	}

	function renameSheet(indexSheet: number, newName: string) {
		dataManager.changeSheetName(indexSheet, newName);
		setSheets((sheets) => {
			sheets[indexSheet].name = newName;
			return sheets;
		});
	}

	return {
		sheets,
		currentSheetIndex: currentSheet,
		currentSheet: sheets[currentSheet],
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
