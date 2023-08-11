import * as React from "react";

interface AddProps {
	className: string;
}
const Add = ({ className }: AddProps) => {
	return (
		<div className="clickable-icon">
			<svg
				className={className}
				width="100%"
				height="100%"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g>
					<line
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						x1="12"
						x2="12"
						y1="19"
						y2="5"
					/>
					<line
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						x1="5"
						x2="19"
						y1="12"
						y2="12"
					/>
				</g>
			</svg>
		</div>
	);
};

export default Add;
