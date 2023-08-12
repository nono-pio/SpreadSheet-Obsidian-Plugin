import * as CSS from "csstype";
import { DataManager } from "../data/DataManager";

export default class CellConfig {
	alignment: Alignment = Alignment.Left;

	colorText: number | null = null;
	colorBackground: number | null = null;

	textBold = false;
	textItalic = false;

	setAlignement(align: Alignment) {
		this.alignment = align;
		return this;
	}

	setTextColor(indexColor: number) {
		this.colorText = indexColor;
		return this;
	}

	setBackgroundColor(indexColor: number) {
		this.colorBackground = indexColor;
		return this;
	}

	setBold(isBold = true) {
		this.textBold = isBold;
		return this;
	}

	setItalic(isItalic = true) {
		this.textItalic = isItalic;
		return this;
	}

	generateStyle(dataManager: DataManager): React.CSSProperties {
		return {
			fontWeight: this.textBold ? "bold" : "normal",
			fontStyle: this.textItalic ? "italic" : "normal",
			textAlign: this.generateAlignement(),
			color:
				this.colorText !== null
					? dataManager.getColor(this.colorText)
					: "inherit",
			backgroundColor:
				this.colorBackground !== null
					? dataManager.getColor(this.colorBackground)
					: "inherit",
		};
	}

	generateAlignement(): CSS.Property.TextAlign | undefined {
		switch (this.alignment) {
			case Alignment.Left:
				return "left";
			case Alignment.Center:
				return "center";
			case Alignment.Right:
				return "right";
			default:
				return undefined;
		}
	}

	getString() {
		let result = "";

		if (this.alignment === Alignment.Right) {
			result += "$r";
		} else if (this.alignment === Alignment.Center) {
			result += "$c";
		}

		if (this.colorText !== null) {
			result +=
				"$t" +
				(this.colorText < 10 ? "0" + this.colorText : this.colorText);
		}

		if (this.colorBackground !== null) {
			result +=
				"$b" +
				(this.colorBackground < 10
					? "0" + this.colorBackground
					: this.colorBackground);
		}

		if (this.textItalic) {
			result += "$i";
		}

		if (this.textBold) {
			result += "$g";
		}

		return result;
	}
}

// | left     |   center   |     right |
export enum Alignment {
	Left,
	Right,
	Center,
}
