import { iter } from "./iter";

export function slice(str: string, start?: number, end?: number): Slice {
	return new Slice(str, start || 0, end);
}

export class Slice implements Iterable<string> {
	constructor(private str: string, private start: number, private end?: number) {}

	get length(): number {
		return (this.end || this.str.length) - this.start;
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
		end = end ? end + this.start : this.end;
		return new Slice(this.str, start, end);
	}

	*[Symbol.iterator](): Iterator<string> {
		for (let i = 0; i < this.str.length; i++) {
			yield this.str[i];
		}
	}
}
