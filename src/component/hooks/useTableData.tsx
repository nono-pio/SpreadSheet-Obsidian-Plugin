import { useState } from "react";

const useTableData: () => [
	TableData,
	(updatedTable: Partial<TableData>) => void
] = () => {
	const [tableData, setTableData] = useState<TableData>({
		activeCell: [-1, -1],
		startSelection: [-1, -1],
		selection: [-1, -1, -1, -1],
		selectionBound: [undefined, undefined, undefined, undefined],
		mousePress: false,
	});

	const updateTable = (updatedTable: Partial<TableData>) => {
		setTableData({ ...tableData, ...updatedTable });
	};

	return [tableData, updateTable];
};

export default useTableData;

export class TableData {
	activeCell: [number, number];
	startSelection: [number, number];
	selection: [top: number, left: number, bottom: number, right: number];
	selectionBound: [
		top: number | undefined,
		left: number | undefined,
		width: number | undefined,
		height: number | undefined
	];
	mousePress: boolean;
}
