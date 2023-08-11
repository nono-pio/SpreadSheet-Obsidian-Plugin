import { App, Modal, Plugin, Setting } from "obsidian";
import { createNewSS } from "./services/data/SpreadSheetCreator";
import { fileStringify } from "./services/file/FileParser";
import { SSView, VIEW_TYPE_SS_PLUGIN } from "./view/SSView";

// Remember to rename these classes and interfaces!

export interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// add view spreadsheet
		this.registerView(
			VIEW_TYPE_SS_PLUGIN,
			(leaf) => new SSView(leaf, this.settings)
		);
		this.registerExtensions(["spreadsheet"], VIEW_TYPE_SS_PLUGIN);

		// add creation for spreadsheet
		this.addRibbonIcon("dice", "Create new spreadsheet", () => {
			new ExampleModal(this.app, (file, sheetName) => {
				const data: string = fileStringify(createNewSS(sheetName));
				this.app.vault.create(file + ".spreadsheet", data);
			}).open();
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export class ExampleModal extends Modal {
	result: string;
	result2: string;
	onSubmit: (result: string, result2: string) => void;

	constructor(app: App, onSubmit: (result: string, result2: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "New SpreadSheet" });

		new Setting(contentEl).setName("File Name").addText((text) =>
			text.onChange((value) => {
				this.result = value;
			})
		);

		new Setting(contentEl).setName("Sheet Name").addText((text) =>
			text.onChange((value) => {
				this.result2 = value;
			})
		);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.result, this.result2);
				})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
