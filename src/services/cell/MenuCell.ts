import { Menu, MenuPositionDef, Notice } from "obsidian";
import { DataManager } from "../data/DataManager";

/*
Title 1
-------
Open
*/

export default class MenuCell implements MenuPositionDef {
	x: number;
	y: number;

	noticeTime = 2500;

	openMenu(
		x: number,
		y: number,
		row: number,
		col: number,
		dataManager: DataManager
	) {
		this.x = x;
		this.y = y;

		const menu = new Menu()
			.addItem((item) =>
				item
					.setTitle("Copy")
					.setSection("1")
					.onClick(() => {
						navigator.clipboard.writeText(
							dataManager.getCellText(col, row)
						);
						new Notice("Cell Copied", this.noticeTime);
					})
			)
			.addItem((item) =>
				item
					.setTitle("Paste")
					.setSection("1")
					.onClick(async () => {
						dataManager.changeCell(
							col,
							row,
							await navigator.clipboard.readText()
						);
						new Notice("Cell Paste", this.noticeTime);
					})
			)
			.addItem((item) =>
				item
					.setTitle("Delete")
					.setSection("1")
					.onClick(async () => {
						dataManager.changeCell(col, row, "", false);
						new Notice("Cell Deleted", this.noticeTime);
					})
			)

			.addSeparator()

			.addItem((item) =>
				item
					.setTitle("Insert Row Left")
					.setSection("2")
					.onClick(() => {
						dataManager.insertColumn(col);
						new Notice("Row Inserted", this.noticeTime);
					})
			)
			.addItem((item) =>
				item
					.setTitle("Insert Row Right")
					.setSection("2")
					.onClick(() => {
						dataManager.insertColumn(col + 1);
						new Notice("Row Inserted", this.noticeTime);
					})
			)
			.addItem((item) =>
				item
					.setTitle("Insert Column Top")
					.setSection("2")
					.onClick(() => {
						dataManager.insertRow(row);
						new Notice("Column Inserted", this.noticeTime);
					})
			)
			.addItem((item) =>
				item
					.setTitle("Insert Column Bottom")
					.setSection("2")
					.onClick(() => {
						dataManager.insertRow(row + 1);
						new Notice("Column Inserted", this.noticeTime);
					})
			);

		menu.load();
		menu.showAtPosition(this);
	}
}
