import * as React from "react";
import { TableProps } from "./SSTable";

// TODO make properties
const Properties = ({ dataManager, setTableData, tableData }: TableProps) => {
	const refNewName = React.useRef<HTMLInputElement>(null);
	const refNewValue = React.useRef<HTMLInputElement>(null);

	const [change, setChange] = React.useState<boolean>(true);
	const [isOpen, setOpen] = React.useState<boolean>(false);
	if (change) {
		setChange(false);
	}

	function addProp() {
		if (
			refNewName.current &&
			refNewValue.current &&
			refNewName.current.value !== ""
		) {
			dataManager.setProperty(
				refNewName.current.value,
				refNewValue.current.value
			);
			refNewName.current.value = "";
			refNewValue.current.value = "";
			setChange(true);
		}
	}

	function handleDelete(index: number) {
		dataManager.deleteProp(index);
		setChange(true);
	}

	function handleChangeName(index: number, name: string) {
		dataManager.setPropertyName(index, name);
	}

	function handleChangeValue(index: number, value: string) {
		dataManager.setPropertyValue(index, value);
	}

	function HeaderProp() {
		return (
			<div className="prop-header">
				<h4>Properties</h4>
				<div
					className="clickable-icon"
					onClick={() => setOpen(!isOpen)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z"
							fill="currentColor"
						/>
					</svg>
				</div>
			</div>
		);
	}

	if (!isOpen) {
		return (
			<div className="properties">
				<HeaderProp />
			</div>
		);
	} else {
		return (
			<div className="properties open">
				<HeaderProp />
				{dataManager.data.properties.map((v, i) => (
					<div className="propertie-item" key={i}>
						<input
							type="text"
							placeholder="Name"
							defaultValue={v.name}
							onChange={(e) =>
								handleChangeName(i, e.target.value)
							}
						/>
						<input
							type="text"
							placeholder="Value"
							defaultValue={v.value}
							onChange={(e) =>
								handleChangeValue(i, e.target.value)
							}
						/>
						<div
							className="clickable-icon"
							onClick={() => handleDelete(i)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M10 11V17" />
								<path d="M14 11V17" />
								<path d="M4 7H20" />
								<path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" />
								<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" />
							</svg>
						</div>
					</div>
				))}
				<div className="propertie-item">
					<input type="text" placeholder="Name" ref={refNewName} />
					<input type="text" placeholder="Value" ref={refNewValue} />
					<div className="clickable-icon" onClick={addProp}>
						<svg
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								stroke="currentColor"
							>
								<line x1="12" x2="12" y1="19" y2="5" />
								<line x1="5" x2="19" y1="12" y2="12" />
							</g>
						</svg>
					</div>
				</div>
			</div>
		);
	}
};

export default Properties;
