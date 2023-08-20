import { useState } from "react";
import { CellPos } from "src/services/cell/Cell";

const useSelection: () => SelectionData = () => {
	const [selection, setSelection] = useState<Selection>([
		[0, 0], //topLeft
		[0, 0], //bottomRight
	]);
	const [startSelection, setStartSelection] = useState<CellPos>([0, 0]);
	const [onSelectionMode, setSelectionMode] = useState<boolean>(false); // is selection cells mode

	const startNewSelection = (pos: CellPos) => {
		setSelectionMode(true);

		setStartSelection(pos);
		setSelection([pos, pos]);
	};

	const endSelection = (pos: CellPos) => {
		setSelectionMode(false);
		updateSelection(pos);
	};

	const updateSelection = (pos: CellPos) => {
		setAndOrderSelection([...startSelection], pos);
	};

	const setAndOrderSelection: SetSelection = (
		posStart: CellPos,
		posEnd: CellPos,
		isStart = false
	) => {
		if (isStart) {
			setStartSelection(posStart);
		}

		setSelection(orderSelection(posStart, posEnd));
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

	return {
		selection,
		startSelection,
		onSelectionMode,
		setSelection: setAndOrderSelection,
		updateSelection,
		startNewSelection,
		endSelection,
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
}
