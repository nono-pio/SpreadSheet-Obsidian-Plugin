import { TextFileView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { MyPluginSettings } from "src/main";
import CellManager from "src/services/cell/CellManager";
import { fileParser, fileStringify } from "src/services/file/FileParser";
import { getViewComp } from "../component/View";
import { SSData } from "../services/data/DataManager";

export const VIEW_TYPE_SS_PLUGIN = "obsidian-plugin-spreadsheet";

export class SSView extends TextFileView {
	settings: MyPluginSettings;
	rootContainer: Root;
	spreadSheetData: SSData;

	constructor(leaf: WorkspaceLeaf, settings: MyPluginSettings) {
		super(leaf);
		this.settings = settings;

		// create root and table container
		this.initRootContainer();
	}

	initRootContainer() {
		this.rootContainer = createRoot(this.contentEl);
	}

	// remake the table
	reloadTable() {
		this.rootContainer.unmount();
		this.rootContainer = createRoot(this.contentEl);
		this.rootContainer.render(getViewComp(this.spreadSheetData));
	}

	// unload view
	getViewData(): string {
		return fileStringify(this.spreadSheetData); // data to json
	}

	// load view with data
	setViewData(data: string): void {
		this.spreadSheetData = fileParser(data); // json to data
		CellManager.Instanciate(this.spreadSheetData); // instanciate the linker of formula
		this.reloadTable(); // reload table with new data
	}

	clear(): void {}

	getViewType(): string {
		return VIEW_TYPE_SS_PLUGIN;
	}
}
