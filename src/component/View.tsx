import * as React from "react";
import { CellPos } from "src/services/cell/Cell";
import { SSData } from "../services/data/DataManager";
import Option from "./Option";
import Selection from "./Selection";
import Sheets from "./Sheets";
import Table from "./Table";
import useSelection from "./hooks/useSelection";
import useSheetsData from "./hooks/useSheetsData";
import useTable from "./hooks/useTable";

export function getViewComp(data: SSData) {
	return <View data={data} />;
}

const View: React.FC<{ data: SSData }> = ({ data }) => {
	const tableRef = React.useRef<HTMLTableElement>(null);
	const sheetsData = useSheetsData(data); // get all sheets
	const tableData = useTable(sheetsData.currentSheet); // get all data from current sheet
	const selectionData = useSelection();

	function getCellElement(cellPos: CellPos) {
		return tableRef.current?.rows[cellPos[1] + 1].cells[cellPos[0] + 1];
	}

	// React.strictMode
	return (
		<div className="spreadsheet">
			<Option tableData={tableData} data={data} />
			<div className="table">
				<Table
					tableRef={tableRef}
					sheet={sheetsData.currentSheet}
					tableData={tableData}
					selectionData={selectionData}
				/>
				<Sheets sheetsData={sheetsData} />
				<Selection
					getCellElement={getCellElement}
					selection={selectionData.selection}
				/>
			</div>
		</div>
	);
};

export default View;
