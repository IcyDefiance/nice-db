export function isAlpha(ch: string) {
	return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
}

export function isAlphanum(ch: string) {
	return isAlpha(ch) || (ch >= "0" && ch <= "9");
}
