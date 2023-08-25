import { useState } from "react";
import Cell, { CellPos } from "src/services/cell/Cell";
import { TableData } from "./useTable";

const useSelection: () => SelectionData = () => {
	const [selection, setSelection] = useState<Selection>([
		[0, 0], //topLeft
		[0, 0], //bottomRight
	]);
	const [startSelection, setStartSelection] = useState<CellPos>([0, 0]);
	const [onSelectionMode, setSelectionMode] = useState<boolean>(false); // is selection cells mode

	const setSelection2 = (newSelection: Selection) => {
		if (!selectionEqual(selection, newSelection)) {
			setSelection(newSelection);
		}
	};

	const setStartSelection2 = (newStart: CellPos) => {
		if (!posEqual(startSelection, newStart)) {
			setStartSelection(newStart);
		}
	};

	const oneCellSelection = (pos: CellPos, startPos: boolean) => {
		setSelection2([pos, pos]);
		if (startPos) {
			setStartSelection2(pos);
		}
	};

	const startNewSelection = (pos: CellPos) => {
		setSelectionMode(true);

		oneCellSelection(pos, true);
	};

	const endSelection = (pos: CellPos) => {
		setSelectionMode(false);
		setAndOrderSelection([...startSelection], pos);
	};

	const updateSelection = (pos: CellPos) => {
		if (onSelectionMode) {
			setAndOrderSelection([...startSelection], pos);
		}
	};

	const setAndOrderSelection: SetSelection = (
		posStart: CellPos,
		posEnd: CellPos,
		isStart = false
	) => {
		if (isStart) {
			setStartSelection2(posStart);
		}

		setSelection2(orderSelection(posStart, posEnd));
	};

	function orderSelection(posA: CellPos, posB: CellPos): [CellPos, CellPos] {
		if (posA[0] > posB[0]) {
			const tmp = posA[0];
			posA[0] = posB[0];
			posB[0] = tmp;
		}

		if (posA[1] > posB[1]) {
			const tmp = posA[1];
			posA[1] = posB[1];
			posB[1] = tmp;
		}

		return [posA, posB];
	}

	function foreachSelectionCellsPos(
		callback: (row: number, column: number) => void
	) {
		for (let row = selection[0][1]; row <= selection[1][1]; row++) {
			for (
				let column = selection[0][0];
				column <= selection[1][0];
				column++
			) {
				callback(row, column);
			}
		}
	}

	function foreachSelectionCells(
		callback: (cell: Cell | undefined, row: number, column: number) => void,
		tableData: TableData
	) {
		foreachSelectionCellsPos((row, col) =>
			callback(tableData.getCell([col, row]), row, col)
		);
	}

	return {
		selection,
		startSelection,
		onSelectionMode,
		setSelection: setAndOrderSelection,
		updateSelection,
		startNewSelection,
		endSelection,
		foreachSelectionCells,
		foreachSelectionCellsPos,
		oneCellSelection,
	};
};

export default useSelection;

export type Selection = [topLeft: CellPos, bottomRight: CellPos];
export type SetSelection = (
	posStart: CellPos,
	posEnd: CellPos,
	isStart?: boolean
) => void;

export interface SelectionData {
	selection: Selection;
	startSelection: CellPos;
	onSelectionMode: boolean;
	setSelection: SetSelection;
	updateSelection: (pos: CellPos) => void;
	startNewSelection: (pos: CellPos) => void;
	endSelection: (pos: CellPos) => void;
	foreachSelectionCells: (
		callback: (cell: Cell | undefined, row: number, column: number) => void,
		tableData: TableData
	) => void;
	foreachSelectionCellsPos: (
		callback: (row: number, column: number) => void
	) => void;
	oneCellSelection: (pos: CellPos, startPos: boolean) => void;
}

export function selectionEqual(
	selectionPrev: Selection,
	selectionNext: Selection
) {
	return (
		posEqual(selectionPrev[0], selectionNext[0]) &&
		posEqual(selectionPrev[1], selectionNext[1])
	);
}

export function posEqual(pos1: CellPos, pos2: CellPos) {
	return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}
