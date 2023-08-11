import Column from "../cell/Column";
import DefaultCell from "../cell/DefaultCell";
import Row from "../cell/Row";
import { SSData, Sheet } from "./DataManager";

const COL_LENGHT = 26;
const ROW_LENGHT = 50;

export function createNewSS(
	firstSheetName: string,
	rowLenght: number = ROW_LENGHT,
	columnLenght: number = COL_LENGHT
): SSData {
	return new SSData(
		[createNewSheet(firstSheetName, rowLenght, columnLenght)],
		[],
		[]
	);
}

export function createNewSheet(
	sheetName: string,
	rowLenght: number = ROW_LENGHT,
	columnLenght: number = COL_LENGHT
): Sheet {
	return new Sheet(
		sheetName,
		[[new DefaultCell()]],
		Array.from({ length: columnLenght }, () => new Column()),
		Array.from({ length: rowLenght }, () => new Row())
	);
}
