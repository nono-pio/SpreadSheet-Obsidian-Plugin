export default class CellConfig {
	alignment: Alignment = Alignment.Left;

	colorText: number | null = null;
	colorBackground: number | null = null;

	textBold = false;
	textItalic = false;

	textSize = -1;

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

	setTextSize(size: number) {
		this.textSize = size;
		return this;
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

		if (this.textSize !== -1) {
			result +=
				"$s" +
				(this.textSize < 10 ? "0" + this.textSize : this.textSize);
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
