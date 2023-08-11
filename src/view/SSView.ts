import { TextFileView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { MyPluginSettings } from "src/main";
import { getViewComp } from "../component/View";
import { DataManager } from "../services/data/DataManager";

export const VIEW_TYPE_SS_PLUGIN = "obsidian-plugin-spreadsheet";

export class SSView extends TextFileView {
	settings: MyPluginSettings;
	rootContainer: Root;
	tableContainer: HTMLDivElement;
	dataManager: DataManager;

	constructor(leaf: WorkspaceLeaf, settings: MyPluginSettings) {
		super(leaf);
		this.settings = settings;
		this.dataManager = new DataManager(this);

		// create root and table container
		this.initRootContainer();
	}

	initRootContainer() {
		this.tableContainer = this.contentEl.createDiv();
		this.tableContainer.addClass("ss-container");
		this.rootContainer = createRoot(this.tableContainer);
	}

	// remake the table
	reloadTable() {
		this.rootContainer.unmount();
		this.rootContainer = createRoot(this.tableContainer);
		this.buildView();
	}

	buildView() {
		this.rootContainer.render(
			getViewComp({ dataManager: this.dataManager })
		);
	}

	getViewData(): string {
		const json = this.dataManager.getDataJSON();
		return json;
	}

	setViewData(data: string): void {
		this.dataManager.setData(data);
		this.reloadTable();
	}

	clear(): void {}

	getViewType(): string {
		return VIEW_TYPE_SS_PLUGIN;
	}
}
