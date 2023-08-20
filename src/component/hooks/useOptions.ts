import { SSData } from "src/services/data/DataManager";

const useOptions = (data: SSData) => {
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

	return {
		colors: data.colors,
		addColor,
		getColor,
	};
};

export default useOptions;
