import * as React from "react";
import { useRef } from "react";
import SSRow from "./SSRow";
import { ViewProps } from "./View";
import { TableData } from "./hooks/useTableData";
import Add from "./icon/Add";

export interface TableProps extends ViewProps {
	tableData: TableData;
	setTableData: (updatedTable: Partial<TableData>) => void;
}

const SStable = ({ dataManager, tableData, setTableData }: TableProps) => {
	const columns = dataManager.getSheet().columns;
	const rows = dataManager.getSheet().rows;

	const tableRef = useRef<HTMLTableElement>(null);
	const selectionRef = useRef<HTMLDivElement>(null);

	function getCellElement(indexRow: number, indexCol: number) {
		if (tableRef.current) {
			return tableRef.current.rows[indexRow + 1].cells[indexCol + 1];
		}
	}

	function select(
		selection: [number, number, number, number],
		data: Partial<TableData> = {}
	) {
		const startCellElement = getCellElement(selection[0], selection[1]);
		const endCellElement = getCellElement(selection[2], selection[3]);

		if (startCellElement && endCellElement && selectionRef.current) {
			const top = startCellElement.offsetTop;
			const left = startCellElement.offsetLeft;
			const width =
				endCellElement.offsetLeft + endCellElement.offsetWidth - left;
			const height =
				endCellElement.offsetTop + endCellElement.offsetHeight - top;

			setTableData({
				selectionBound: [top, left, width, height],
				selection: selection,
				mousePress: true,
				...data,
			});
		}
	}

	function copy() {
		let result = "";
		for (
			let rowIndex = tableData.selection[0];
			rowIndex <= tableData.selection[2];
			rowIndex++
		) {
			for (
				let colIndex = tableData.selection[1];
				colIndex <= tableData.selection[3];
				colIndex++
			) {
				result += dataManager.getCellText(colIndex, rowIndex) + "\t";
			}
			result += "\n";
		}

		navigator.clipboard.writeText(result);
	}

	function keyDownEvent(key: string, keyCtrl: boolean) {
		switch (key) {
			case "c":
				copy();
				break;
			case "v":
				break;
			case "x":
				break;
			case "Delete" || "Backslash":
				break;
		}
	}

	return (
		<>
			<div className="top-table" />
			<div style={{ position: "relative" }}>
				<table
					className="ss-table"
					ref={tableRef}
					onKeyDown={(e) => keyDownEvent(e.key, e.ctrlKey)}
					tabIndex={0}
				>
					<thead>
						<tr key={-1}>
							<th key={-1} className="empty-case">
								\
							</th>

							{columns.map((column, index) => (
								<th
									key={index}
									className={
										tableData.selection[1] <= index &&
										index <= tableData.selection[3]
											? "column-active"
											: ""
									}
									onClick={() =>
										setTableData({
											activeCell: [-1, index],
										})
									}
								>
									{column.getText(index)}
								</th>
							))}

							<th
								key={"add-col"}
								style={{ padding: "0" }}
								className="add-col"
								onClick={() => dataManager.addMaxColumn()}
							>
								<Add className="icon-add-columns" />
							</th>
						</tr>
					</thead>

					<tbody>
						{rows.map((row, index) => (
							<tr key={index}>
								<th
									key={-1}
									className={
										tableData.selection[0] <= index &&
										index <= tableData.selection[2]
											? "row-active"
											: ""
									}
									onClick={() =>
										setTableData({
											activeCell: [index, -1],
										})
									}
								>
									{row.getText(index)}
								</th>

								<SSRow
									columns={columns}
									dataManager={dataManager}
									rowIndex={index}
									tableData={tableData}
									setTableData={setTableData}
									select={select}
								/>

								<th key="add-col" className="add-col"></th>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr key="add-row">
							<th
								key={-1}
								className="add-row"
								onClick={() => dataManager.addMaxRow()}
								style={{ padding: "0" }}
							>
								<Add className="icon-add-row" />
							</th>

							{columns.map((_, index) => (
								<th className="add-row" key={index}></th>
							))}

							<th
								key="add-col add-row"
								className="add-col add-row"
							></th>
						</tr>
					</tfoot>
				</table>
				<div
					className="selection"
					ref={selectionRef}
					style={{
						top: tableData.selectionBound[0],
						left: tableData.selectionBound[1],
						width: tableData.selectionBound[2],
						height: tableData.selectionBound[3],
					}}
				/>
			</div>
		</>
	);
};

export default SStable;
