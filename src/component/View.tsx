import React, { useRef } from "react";
import { CellPos } from "src/services/cell/Cell";
import { SSData } from "../services/data/DataManager";
import Option from "./Option";
import SelectionBox from "./SelectionBox";
import Sheets from "./Sheets";
import Table from "./Table";
import useSelection from "./hooks/useSelection";
import useSheetsData from "./hooks/useSheetsData";
import useStyle from "./hooks/useStyle";
import useTable from "./hooks/useTable";

interface ViewProps {
	data: SSData;
}

const View: React.FC<ViewProps> = ({ data }) => {
	const tableRef = useRef<HTMLTableElement>(null);
	const sheetsData = useSheetsData(data);
	const currentSheet = sheetsData.currentSheet;
	const tableData = useTable(currentSheet);
	const selectionData = useSelection();
	const style = useStyle(data);

	// Reset table change flag when necessary
	React.useEffect(() => {
		if (tableData.tableChange) {
			tableData.resetTableChange();
		}
	}, [tableData.tableChange]);

	// Get a cell element based on its position
	function getCellElement(cellPos: CellPos) {
		return tableRef.current?.rows[cellPos[1] + 1]?.cells[cellPos[0] + 1];
	}

	return (
		<div className="spreadsheet">
			<Option
				tableData={tableData}
				addColor={style.addColor}
				selection={selectionData.selection}
			/>
			<div className="table">
				<Table
					tableRef={tableRef}
					sheet={currentSheet}
					tableData={tableData}
					selectionData={selectionData}
					style={style}
				/>
				<Sheets sheetsData={sheetsData} />
				<SelectionBox
					getCellElement={getCellElement}
					selection={selectionData.selection}
				/>
			</div>
		</div>
	);
};

export function getViewComp(data: SSData) {
	return <View data={data} />;
}

export default View;
