import { Propertie, SSData, Sheet } from "../data/DataManager";

export default class CellManager {
	sheet: Sheet;
	properties: Propertie[];

	static instance: CellManager;

	static Instanciate(data: SSData) {
		this.instance = new CellManager();
		this.instance.sheet = data.sheets[0];
		this.instance.properties = data.properties;
	}

	setSheet(sheet: Sheet) {
		this.sheet = sheet;
	}

	getCellValue(column: number, row: number) {
		const cell = this.sheet.table[row][column];
		return cell ? cell.getCellText() : "";
	}

	getPropValue(propName: string): string | undefined {
		const prop = this.properties.find((prop) => prop.name === propName);
		return prop?.value;
	}
}
