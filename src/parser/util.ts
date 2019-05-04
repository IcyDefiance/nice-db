export function isAlpha(ch: string) {
	return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
}

export function isAlphanum(ch: string) {
	return isAlpha(ch) || isDigit(ch);
}

export function isDigit(ch: string) {
	return ch >= "0" && ch <= "9";
}
