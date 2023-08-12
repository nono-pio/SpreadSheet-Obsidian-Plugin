import Cell from "../cell/Cell";
import CellConfig, { Alignment } from "../cell/CellConfig";
import Column from "../cell/Column";
import DefaultCell from "../cell/DefaultCell";
import FormulaCell from "../cell/FormulaCell";
import Row from "../cell/Row";
import { Propertie, SSData, Sheet } from "../data/DataManager";
import parseFormula from "../formula/FormulaParser";

// -----------------------------------------------------------------------------------------

export function fileParser(data: string): SSData {
	const file: PSSData = JSON.parse(data);

	const properties = Array.from(
		{ length: file.propersties.length },
		(_, v) => {
			const prop = file.propersties[v];
			return new Propertie(prop.name, prop.value);
		}
	);

	const sheets = Array.from({ length: file.sheets.length }, (_, k) =>
		parseSheet(file.sheets[k])
	);

	return new SSData(sheets, properties, file.colors);
}

export function csv1D(data: string) {
	return data.split(",");
}

export function csv2D(data: string): string[][] {
	return data.split("\n").map((v) => v.split(","));
}

function parseSheet(sheet: PSheet): Sheet {
	const tableSTR = csv2D(sheet.table);
	const table = tableSTR.map((v) => v.map((k) => csvParserCell(k)));

	const columnSTR = csv1D(sheet.columns);
	const columns = Array.from(
		{ length: columnSTR.length },
		() => new Column()
	);

	const rowSTR = csv1D(sheet.rows);
	const rows = Array.from({ length: rowSTR.length }, () => new Row());

	return new Sheet(sheet.name, table, columns, rows);
}

// modification cell
export function parserCell(value: string, config: CellConfig | null): Cell {
	if (value.startsWith("=")) {
		const formula = parseFormula(value.substring(1, value.length));
		return new FormulaCell(formula, value, config);
	} else {
		return new DefaultCell(value, config);
	}
}

// creation of the cell
export function csvParserCell(value: string): Cell {
	let config: null | CellConfig = null;

	while (value.startsWith("$")) {
		let isModifier = false;
		for (const modifier of modifiers) {
			if (value.startsWith(modifier.ID)) {
				const id = value.substring(0, modifier.idSize);
				value = value.substring(modifier.idSize, value.length);

				config = modifier.configOption(
					config === null ? new CellConfig() : config,
					id
				);
				isModifier = true;
				break;
			}
		}
		if (!isModifier) {
			break;
		}
	}

	const finalValue = value
		.replace("$v", ",")
		.replace("$n", "\n")
		.replace("$_", "$");

	try {
		return parserCell(finalValue, config);
	} catch (error) {
		return new DefaultCell(finalValue, config);
	}
}

class Modifier {
	ID: string;
	idSize: number;
	configOption: (config: CellConfig, id: string) => CellConfig;
}
const modifiers: Modifier[] = [
	{
		ID: "$l",
		configOption: (config) => config.setAlignement(Alignment.Left),
		idSize: 2,
	},
	{
		ID: "$c",
		configOption: (config) => config.setAlignement(Alignment.Center),
		idSize: 2,
	},
	{
		ID: "$r",
		configOption: (config) => config.setAlignement(Alignment.Right),
		idSize: 2,
	},
	{
		ID: "$t",
		configOption: (config, id) => {
			const indexColor = parseInt(id.substring(2, 4));
			return config.setTextColor(indexColor);
		},
		idSize: 4, // \tXX
	},
	{
		ID: "$b",
		configOption: (config, id) => {
			const indexColor = parseInt(id.substring(2, 4));
			return config.setBackgroundColor(indexColor);
		},
		idSize: 4,
	},
	{
		ID: "$i",
		configOption: (config) => config.setItalic(),
		idSize: 2,
	},
	{
		ID: "$g",
		configOption: (config) => config.setBold(),
		idSize: 2,
	},
];

/*

\ID

ID	name

l	left align
c	center align
r	right align

tXX	text color XX: index color
bXX background color XX:index color

i	italic
g	bold

<------ Text Value --------->
\	backslash
v	coma
n	new line

*/

// -----------------------------------------------------------------------------------------

export function fileStringify(data: SSData): string {
	const properties = Array.from(
		{ length: data.properties.length },
		(_, k) => {
			const prop = data.properties[k];
			return new PVariable(prop.name, prop.value);
		}
	);

	const sheets = Array.from({ length: data.sheets.length }, (_, k) => {
		const sheet = data.sheets[k];
		return new PSheet(
			sheet.name,
			csv2DStringify(
				sheet.table.map((v) => v.map((k) => cellStringify(k)))
			),
			csv1DStringify(sheet.columns.map((v) => v.getData())),
			csv1DStringify(sheet.rows.map((v) => v.getData()))
		);
	});

	return JSON.stringify(new PSSData(properties, data.colors, sheets));
}

export function cellStringify(cell: Cell) {
	const data = cell
		.getData()
		.replace(",", "$v")
		.replace("\n", "$n")
		.replace("$", "$_");

	return (cell.config === null ? "" : cell.config.getString()) + data;
}

export function csv1DStringify(data: string[]): string {
	return data.join(",");
}

export function csv2DStringify(data: string[][]): string {
	return data.map((v) => v.join(",")).join("\n");
}

// -----------------------------------------------------------------------------------------
// Parser version of the datas
class PSSData {
	propersties: PVariable[];
	colors: string[];
	sheets: PSheet[];
	constructor(propersties: PVariable[], colors: string[], sheets: PSheet[]) {
		this.propersties = propersties;
		this.colors = colors;
		this.sheets = sheets;
	}
}

class PVariable {
	name: string;
	value: string;
	constructor(name: string, value: string) {
		this.name = name;
		this.value = value;
	}
}

class PSheet {
	name: string;
	table: string; // string csv
	columns: string; // string csv
	rows: string; // string csv
	constructor(name: string, table: string, columns: string, rows: string) {
		this.columns = columns;
		this.name = name;
		this.rows = rows;
		this.table = table;
	}
}
