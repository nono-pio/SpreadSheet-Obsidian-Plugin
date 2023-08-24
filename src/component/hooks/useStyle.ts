import Cell from "src/services/cell/Cell";
import CellConfig, { Alignment } from "src/services/cell/CellConfig";
import Column from "src/services/cell/Column";
import Row from "src/services/cell/Row";
import { SSData } from "src/services/data/DataManager";

const useStyle: (data: SSData) => Style = (data) => {
	function addColor(color: string) {
		const indexColor = getColor(color);
		if (indexColor) {
			return indexColor;
		} else {
			return data.colors.push(color) - 1;
		}
	}

	function getColor(color: string): number | undefined {
		for (let index = 0; index < data.colors.length; index++) {
			if (color === data.colors[index]) {
				return index;
			}
		}
		return undefined;
	}

	function generateStyle(
		cell: Cell,
		row: Row,
		column: Column
	): React.CSSProperties {
		let style = {};
		if (column.config) {
			style = generateStyleFromConfig(column.config);
		}
		if (row.config) {
			style = { ...style, ...generateStyleFromConfig(row.config) };
		}
		if (cell.config) {
			style = { ...style, ...generateStyleFromConfig(cell.config) };
		}
		return style;
	}

	function generateStyleFromConfig(config: CellConfig): React.CSSProperties {
		return {
			fontWeight: config.textBold ? "bold" : "normal",
			fontStyle: config.textItalic ? "italic" : "normal",
			textAlign: generateAligmnentStyle(config.alignment),
			color:
				config.colorText !== null
					? data.colors[config.colorText]
					: "inherit",
			backgroundColor:
				config.colorBackground !== null
					? data.colors[config.colorBackground]
					: "inherit",
			fontSize: config.textSize === -1 ? undefined : config.textSize,
		};
	}

	function generateAligmnentStyle(alignment: Alignment) {
		switch (alignment) {
			case Alignment.Left:
				return "left";
			case Alignment.Right:
				return "right";
			case Alignment.Center:
				return "center";
			default:
				return "left";
		}
	}

	return {
		colors: data.colors,
		addColor,
		getColor,
		generateStyle,
	};
};

export default useStyle;

export interface Style {
	colors: string[];
	addColor: (color: string) => number;
	getColor: (color: string) => number | undefined;
	generateStyle: (
		cell: Cell,
		row: Row,
		column: Column
	) => React.CSSProperties;
}
