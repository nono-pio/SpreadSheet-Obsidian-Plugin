export default class CellConfig {
	alignment: Alignment = Alignment.Left;

	colorText = -1;
	colorBackground = -1;

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

	getString() {
		let result = "";

		if (this.alignment === Alignment.Right) {
			result += "$r";
		} else if (this.alignment === Alignment.Center) {
			result += "$c";
		}

		if (this.colorText !== -1) {
			result +=
				"$t" +
				(this.colorText < 10 ? "0" + this.colorText : this.colorText);
		}

		if (this.colorBackground !== -1) {
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
