import * as React from "react";
import { CellPos } from "src/services/cell/Cell";
import { DataManager } from "../services/data/DataManager";
import Option from "./Option";
import Selection from "./Selection";
import Sheets from "./Sheets";
import Table from "./Table";
import useSheetsData from "./hooks/useSheetsData";
import useTable from "./hooks/useTable";

export function getViewComp(dataManager: DataManager) {
	return <View dataManager={dataManager} />;
}

const View: React.FC<{ dataManager: DataManager }> = ({ dataManager }) => {
	const tableRef = React.useRef<HTMLTableElement>(null);
	const sheetsData = useSheetsData(dataManager);
	const tableData = useTable(sheetsData.currentSheet);

	function getCellElement(cellPos: CellPos) {
		return tableRef.current?.rows[cellPos[1]].cells[cellPos[0]];
	}

	console.log("Render View");

	// React.strictMode
	return (
		<div className="spreadsheet">
			<Option tableData={tableData} />
			<div className="table">
				<Table
					tableRef={tableRef}
					sheet={sheetsData.currentSheet}
					tableData={tableData}
				/>
				<Sheets sheetsData={sheetsData} />
				<Selection getCellElement={getCellElement} />
			</div>
		</div>
	);
};

export default View;
