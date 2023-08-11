import * as React from "react";
import { DataManager } from "../services/data/DataManager";
import Options from "./Options";
import SSTable from "./SSTable";
import Sheets from "./Sheets";
import useTableData from "./hooks/useTableData";

export function getViewComp(props: ViewProps) {
	return <View {...props} />;
}

export interface ViewProps {
	dataManager: DataManager;
}

const View = ({ dataManager }: ViewProps) => {
	const [tableData, setTableData] = useTableData();

	return (
		<React.StrictMode>
			<Options />
			<SSTable
				dataManager={dataManager}
				tableData={tableData}
				setTableData={setTableData}
			/>
			<Sheets
				dataManager={dataManager}
				tableData={tableData}
				setTableData={setTableData}
			/>
		</React.StrictMode>
	);
};

export default View;
