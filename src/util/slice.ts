import { iter } from "./iter";
import { Frozen, Immutable } from "./decorators";

export function sliceStr(str: string, start?: number, end?: number): SliceStr {
	return new SliceStr(str, start || 0, end);
}

export function sliceArr<T>(arr: T[], start?: number, end?: number): SliceArr<T> {
	return new SliceArr(arr, start || 0, end);
}

@Frozen
@Immutable
export class SliceStr implements Iterable<string> {
	constructor(public readonly str: string, public readonly start: number, public readonly end?: number) {}

	get length(): number {
		return (typeof this.end === "undefined" ? this.str.length : this.end) - this.start;
	}

	eq(other: string | SliceStr): boolean {
		return this.length === other.length && iter(this).eq(other);
	}

	get(index: number): string {
		if (index < 0) {
			throw new Error("`index` must be gte 0");
		}
		return this.str[this.start + index];
	}

	slice(start?: number, end?: number): SliceStr {
		start = (start || 0) + this.start;
		end = typeof end === "undefined" ? this.end : end + this.start;
		return new SliceStr(this.str, start, end);
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

@Frozen
@Immutable
export class SliceArr<T> implements Iterable<T> {
	constructor(public readonly arr: T[], public readonly start: number, public readonly end?: number) {}

	get length(): number {
		return (typeof this.end === "undefined" ? this.arr.length : this.end) - this.start;
	}

	get(index: number): T {
		if (index < 0) {
			throw new Error("`index` must be gte 0");
		}
		return this.arr[this.start + index];
	}

	slice(start?: number, end?: number): SliceArr<T> {
		start = (start || 0) + this.start;
		end = typeof end === "undefined" ? this.end : end + this.start;
		return new SliceArr(this.arr, start, end);
	}

	toUpperCase(): string {
		return this.toString().toUpperCase();
	}

	toArray(): T[] {
		return this.arr.slice(this.start, this.end);
	}

	*[Symbol.iterator](): Iterator<T> {
		for (let i = 0; i < this.arr.length; i++) {
			yield this.arr[i];
		}
	}
}
