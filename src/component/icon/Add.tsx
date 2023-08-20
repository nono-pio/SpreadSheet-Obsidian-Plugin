import * as React from "react";

const Add = () => {
	return (
		<div className="clickable-icon" style={{ padding: 0 }}>
			<svg
				className="add-icon"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				stroke="currentColor"
			>
				<g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
					<line x1="12" x2="12" y1="19" y2="5" />
					<line x1="5" x2="19" y1="12" y2="12" />
				</g>
			</svg>
		</div>
	);
};

export default Add;
