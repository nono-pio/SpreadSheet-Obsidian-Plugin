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

	function deleteSelection() {
		setTableData({ needUpdate: true });
		dataManager.getForEachCellSelection(
			tableData.selection,
			(_, row, col) => {
				dataManager.changeCell(col, row, "");
			}
		);
	}

	async function paste() {
		const data = await navigator.clipboard.readText();
		const subTable = data.split("\n").map((line) => line.split("\t"));

		for (let r = 0; r < subTable.length; r++) {
			for (let c = 0; c < subTable[0].length; c++) {
				dataManager.changeCell(
					c + tableData.startSelection[1],
					r + tableData.startSelection[0],
					subTable[r][c]
				);
			}
		}

		setTableData({ needUpdate: true });
	}

	function keyDownEvent(key: string, keyCtrl: boolean) {
		switch (key) {
			case "c":
				copy();
				break;
			case "v":
				paste();
				break;
			case "x":
				copy();
				deleteSelection();
				break;
			case "Delete" || "Backslash":
				deleteSelection();
				break;
			case "ArrowUp": {
				const startSelection: [number, number] = [
					Math.max(tableData.startSelection[0] - 1, 0),
					tableData.startSelection[1],
				];
				select([...startSelection, ...startSelection], {
					mousePress: false,
					startSelection: startSelection,
				});
				break;
			}
			case "ArrowDown": {
				const startSelection: [number, number] = [
					Math.min(tableData.startSelection[0] + 1, rows.length - 1),
					tableData.startSelection[1],
				];
				select([...startSelection, ...startSelection], {
					mousePress: false,
					startSelection: startSelection,
				});
				break;
			}
			case "ArrowLeft": {
				const startSelection: [number, number] = [
					tableData.startSelection[0],
					Math.max(tableData.startSelection[1] - 1, 0),
				];
				select([...startSelection, ...startSelection], {
					mousePress: false,
					startSelection: startSelection,
				});
				break;
			}
			case "ArrowRight": {
				const startSelection: [number, number] = [
					tableData.startSelection[0],
					Math.min(
						tableData.startSelection[1] + 1,
						columns.length - 1
					),
				];
				select([...startSelection, ...startSelection], {
					mousePress: false,
					startSelection: startSelection,
				});
				break;
			}
			case "Enter": {
				const startSelection: [number, number] = [
					Math.min(tableData.startSelection[0] + 1, rows.length - 1),
					tableData.startSelection[1],
				];
				select([...startSelection, ...startSelection], {
					mousePress: false,
					startSelection: startSelection,
					activeCell: [-1, -1],
				});
				break;
			}
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
										select(
											[0, index, rows.length - 1, index],
											{
												startSelection: [0, index],
												mousePress: false,
											}
										)
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
										select(
											[
												index,
												0,
												index,
												columns.length - 1,
											],
											{
												startSelection: [index, 0],
												mousePress: false,
											}
										)
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
