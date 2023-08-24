import React, { FC, useMemo, useRef } from "react";
import CellConfig, { Alignment } from "src/services/cell/CellConfig";
import Cell from "../services/cell/Cell";
import { Selection } from "./hooks/useSelection";
import { Style } from "./hooks/useStyle";
import { TableData } from "./hooks/useTable";

/*
TODO : 
- color/bgcolor
- update size
*/
const Option: FC<{
	tableData: TableData;
	addColor: Style["addColor"];
	selection: Selection;
}> = ({ tableData, addColor, selection }) => {
	const textColorRef = useRef<HTMLInputElement>(null);
	const textBackgroundRef = useRef<HTMLInputElement>(null);
	const fontSizeRef = useRef<HTMLInputElement>(null);

	function setConfig(
		configCallback: (config: CellConfig, most: boolean) => CellConfig,
		getDataFromSelection?: (config: CellConfig | null) => boolean
	) {
		function foreachSelectionCells(
			selection: Selection,
			callback: (config: Cell) => boolean
		) {
			let count = 0;
			for (let row = selection[0][1]; row <= selection[1][1]; row++) {
				for (
					let column = selection[0][0];
					column <= selection[1][0];
					column++
				) {
					const cell = tableData.getCell([column, row]);
					if (cell) {
						const isCount = callback(cell);
						if (isCount) {
							count++;
						}
					}
				}
			}
			return (
				count /
				((selection[1][1] - selection[0][1]) *
					(selection[1][0] - selection[0][0]))
			);
		}

		if (selection) {
			tableData.changeTable();
			if (getDataFromSelection) {
				const count = foreachSelectionCells(selection, (cell) =>
					getDataFromSelection(cell.config)
				);
				foreachSelectionCells(selection, (cell) => {
					cell.config = configCallback(
						cell.config ? cell.config : new CellConfig(),
						count >= 0.5
					);
					return false;
				});
			} else {
				foreachSelectionCells(selection, (cell) => {
					cell.config = configCallback(
						cell.config ? cell.config : new CellConfig(),
						false
					);
					return false;
				});
			}
		}
	}

	const handleAlignmentChange = (alignment: Alignment) => {
		setConfig((config) => config.setAlignement(alignment));
	};

	const handleTextColorChange = () => {
		const color = textColorRef.current?.value || "000000";
		setConfig((config) => config.setTextColor(addColor(color)));
	};

	const handleTextBackgroundChange = () => {
		const color = textBackgroundRef.current?.value || "000000";
		setConfig((config) => config.setBackgroundColor(addColor(color)));
	};

	const handleFontSizeChange = () => {
		const fontSize = fontSizeRef.current?.valueAsNumber || 16;
		setConfig((config) => config.setTextSize(fontSize));
	};

	const optionItems = useMemo(() => {
		return {
			bold: (
				<OptionItem>
					<button
						className="Bold"
						onClick={() =>
							setConfig(
								(config, mostBold) => config.setBold(!mostBold),
								(config) => !config || config.textBold
							)
						}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 384 512"
						>
							<path
								fill="currentColor"
								d="M304.793 243.891c33.639-18.537 53.657-54.16 53.657-95.693 0-48.236-26.25-87.626-68.626-104.179C265.138 34.01 240.849 32 209.661 32H24c-8.837 0-16 7.163-16 16v33.049c0 8.837 7.163 16 16 16h33.113v318.53H24c-8.837 0-16 7.163-16 16V464c0 8.837 7.163 16 16 16h195.69c24.203 0 44.834-1.289 66.866-7.584C337.52 457.193 376 410.647 376 350.014c0-52.168-26.573-91.684-71.207-106.123zM142.217 100.809h67.444c16.294 0 27.536 2.019 37.525 6.717 15.828 8.479 24.906 26.502 24.906 49.446 0 35.029-20.32 56.79-53.029 56.79h-76.846V100.809zm112.642 305.475c-10.14 4.056-22.677 4.907-31.409 4.907h-81.233V281.943h84.367c39.645 0 63.057 25.38 63.057 63.057.001 28.425-13.66 52.483-34.782 61.284z"
							></path>
						</svg>
					</button>
				</OptionItem>
			),
			italic: (
				<OptionItem>
					<button
						className="Italic"
						onClick={() =>
							setConfig(
								(config, mostItalic) =>
									config.setItalic(!mostItalic),
								(config) => !config || config.textItalic
							)
						}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 320 512"
						>
							<path
								fill="currentColor"
								d="M204.758 416h-33.849l62.092-320h40.725a16 16 0 0 0 15.704-12.937l6.242-32C297.599 41.184 290.034 32 279.968 32H120.235a16 16 0 0 0-15.704 12.937l-6.242 32C96.362 86.816 103.927 96 113.993 96h33.846l-62.09 320H46.278a16 16 0 0 0-15.704 12.935l-6.245 32C22.402 470.815 29.967 480 40.034 480h158.479a16 16 0 0 0 15.704-12.935l6.245-32c1.927-9.88-5.638-19.065-15.704-19.065z"
							></path>
						</svg>
					</button>
				</OptionItem>
			),
			alignLeft: (
				<OptionItem>
					<button
						className="align-left"
						onClick={() => handleAlignmentChange(Alignment.Left)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
						>
							<path
								fill="currentColor"
								d="M288 44v40c0 8.837-7.163 16-16 16H16c-8.837 0-16-7.163-16-16V44c0-8.837 7.163-16 16-16h256c8.837 0 16 7.163 16 16zM0 172v40c0 8.837 7.163 16 16 16h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16zm16 312h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm256-200H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16h256c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16z"
							></path>
						</svg>
					</button>
				</OptionItem>
			),
			alignCenter: (
				<OptionItem>
					<button
						className="align-center"
						onClick={() => handleAlignmentChange(Alignment.Center)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
						>
							<path
								fill="currentColor"
								d="M352 44v40c0 8.837-7.163 16-16 16H112c-8.837 0-16-7.163-16-16V44c0-8.837 7.163-16 16-16h224c8.837 0 16 7.163 16 16zM16 228h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 256h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm320-200H112c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16h224c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16z"
							></path>
						</svg>
					</button>
				</OptionItem>
			),
			alignRight: (
				<OptionItem>
					<button
						className="align-right"
						onClick={() => handleAlignmentChange(Alignment.Right)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
						>
							<path
								fill="currentColor"
								d="M160 84V44c0-8.837 7.163-16 16-16h256c8.837 0 16 7.163 16 16v40c0 8.837-7.163 16-16 16H176c-8.837 0-16-7.163-16-16zM16 228h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 256h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm160-128h256c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H176c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
							></path>
						</svg>
					</button>
				</OptionItem>
			),
			colorText: (
				<OptionItem>
					<input type="color" ref={textColorRef} />
					<button onClick={handleTextColorChange}>
						<svg
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill="currentColor"
								d="M15.111,15a1,1,0,0,0,1,1H20a1,1,0,0,0,0-2H18.676L13.705,1.627A1,1,0,0,0,12.777,1H11.223a1,1,0,0,0-.928.627L5.324,14H4a1,1,0,0,0,0,2H7.889a1,1,0,0,0,0-2h-.41l1.607-4h5.828l1.607,4h-.41A1,1,0,0,0,15.111,15ZM9.89,8,11.9,3h.2L14.11,8ZM22,18H2a1,1,0,0,0-1,1v3a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V19A1,1,0,0,0,22,18Zm-1,3H3V20H21Z"
							/>
						</svg>
					</button>
				</OptionItem>
			),
			colorBackground: (
				<OptionItem>
					<input type="color" ref={textBackgroundRef} />
					<button onClick={handleTextBackgroundChange}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 32 32"
						>
							<path
								fill="currentColor"
								d="M7.293,16.302l-1.155,1.13c0,0-0.138,0.134-0.138,0.577v3c0,1.104-0.896,2-2,2s-2-0.896-2-2v-4 c0-2.01,1.332-5,5-5l4.585,0.001L7.293,16.302z M17,17.29c0.553,0,1-0.447,1-1V7c0-2.823,2.504-2.994,2.994-3C21.496,4.006,24,4.177,24,7v4.528l2,2V7c0-3.955-3.271-5-5-5s-5,1.045-5,5v9.29C16,16.843,16.447,17.29,17,17.29z M29.586,18.494L19,8v8.29c0,1.103-0.897,2-2,2c-1.103,0-2-0.897-2-2v-6.281l-8,8l11.586,11.485c0.778,0.778,2.051,0.778,2.828,0l8.172-8.172C30.364,20.545,30.364,19.272,29.586,18.494z M4,24.977c-1.105,0-2,0.895-2,2c0,1.105,0.895,2,2,2s2-0.895,2-2C6,25.873,5.105,24.977,4,24.977z"
							/>
						</svg>
					</button>
				</OptionItem>
			),
			fontSize: (
				<OptionItem>
					<input
						type="number"
						placeholder="Font Size"
						ref={fontSizeRef}
					/>
					<button onClick={handleFontSizeChange}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M2,21H6a1,1,0,0,0,0-2H5.376l1.951-6h5.346l1.95,6H14a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2H16.727L11.751,3.69A1,1,0,0,0,10.8,3H9.2a1,1,0,0,0-.951.69L3.273,19H2a1,1,0,0,0,0,2ZM9.927,5h.146l1.95,6H7.977ZM23,16a1,1,0,0,1-1,1H19a1,1,0,0,1,0-2h.365l-.586-1.692H17a1,1,0,0,1,0-2h1.087L17.288,9h-.576l-.113.327a1,1,0,0,1-1.891-.654l.346-1A1,1,0,0,1,16,7h2a1,1,0,0,1,.945.673L21.481,15H22A1,1,0,0,1,23,16Z" />
						</svg>
					</button>
				</OptionItem>
			),
		};
	}, []);

	return (
		<div className="option">
			{optionItems.bold}
			{optionItems.italic}
			<div className="seperator" />
			{optionItems.alignLeft}
			{optionItems.alignCenter}
			{optionItems.alignRight}
			<div className="seperator" />
			{optionItems.colorText}
			{optionItems.colorBackground}
			<div className="seperator" />
			{optionItems.fontSize}
		</div>
	);
};

export default Option;

const OptionItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div className="option-item">{children}</div>
);
