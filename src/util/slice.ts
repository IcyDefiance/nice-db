import { iter } from "./iter";

export function slice(str: string, start?: number, end?: number): Slice {
	return new Slice(str, start || 0, end);
}

export class Slice implements Iterable<string> {
	constructor(public str: string, public start: number, public end?: number) {}

	get length(): number {
		return (typeof this.end === "undefined" ? this.str.length : this.end) - this.start;
	}

	eq(other: string | Slice): boolean {
		return this.length === other.length && iter(this).eq(other);
	}

	get(index: number): string {
		if (index < 0) {
			throw new Error("`index` must be gte 0");
		}
		return this.str[this.start + index];
	}

	slice(start?: number, end?: number): Slice {
		start = (start || 0) + this.start;
		end = typeof end === "undefined" ? this.end : end + this.start;
		return new Slice(this.str, start, end);
	}

	toUpperCase(): string {
		return this.toString().toUpperCase();
	}

	toString(): string {
		return this.str.slice(this.start, this.end);
	}

	*[Symbol.iterator](): Iterator<string> {
		for (let i = 0; i < this.str.length; i++) {
			yield this.str[i];
		}
	}
}
