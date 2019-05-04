import { Frozen, Immutable } from "./decorators";
import { IOption, some, none } from "../util/option";

export function iter<T>(iterable: Iterable<T>): Iter<T> {
	return new BasicIter(iterable);
}

@Frozen
export abstract class Iter<T> implements Iterable<T> {
	protected abstract iterable(): Iterable<T>;

	[Symbol.iterator](): Iterator<T> {
		return this.iterable()[Symbol.iterator]();
	}

	// --- OPERATORS ---

	enumerate(): Iter<[number, T]> {
		return this.makeTransform(enumerate);
	}

	filter(cb: (item: T) => boolean): Iter<T> {
		return this.makeTransform(filter, cb);
	}

	inspect(cb: (item: T) => void): Iter<T> {
		return this.makeTransform(inspect, cb);
	}

	map<U>(cb: (item: T) => U): Iter<U> {
		return this.makeTransform(map, cb);
	}

	skip(count: number): Iter<T> {
		return this.makeTransform(skip, count);
	}

	// --- COLLECTORS ---

	any(cb: (item: T) => boolean): boolean {
		for (const item of this.iterable()) {
			if (cb(item)) {
				return true;
			}
		}
		return false;
	}

	eq(other: Iterable<T>): boolean {
		const left = this.iterable()[Symbol.iterator]();
		const right = other[Symbol.iterator]();
		while (true) {
			const x1 = left.next();
			const x2 = right.next();
			if (x1.done && x2.done) {
				return true;
			} else if (x1.done || x2.done || x1.value !== x2.value) {
				return false;
			}
		}
	}

	nth(index: number): IOption<T> {
		for (const item of this.iterable()) {
			if (index <= 0) {
				return some(item);
			}

			--index;
		}

		return none;
	}

	// --- PRIVATE ---

	private makeTransform<U, Args extends any[]>(
		func: (iter: Iterable<T>, ...args: Args) => IterableIterator<U>,
		...args: Args
	): TransformIter<T, U> {
		return new TransformIter(this.iterable(), (iter) => func(iter, ...args));
	}
}

function* enumerate<T>(iter: Iterable<T>): IterableIterator<[number, T]> {
	let i = 0;
	for (const item of iter) {
		yield [i, item];
		i++;
	}
}

function* filter<T>(iter: Iterable<T>, cb: (item: T) => boolean): IterableIterator<T> {
	for (const item of iter) {
		if (cb(item)) {
			yield item;
		}
	}
}

function* inspect<T>(iter: Iterable<T>, cb: (item: T) => void): IterableIterator<T> {
	for (const item of iter) {
		cb(item);
		yield item;
	}
}

function* map<T, U>(iter: Iterable<T>, cb: (item: T) => U): IterableIterator<U> {
	for (const item of iter) {
		yield cb(item);
	}
}

function* skip<T>(iter: Iterable<T>, count: number): IterableIterator<T> {
	for (const item of iter) {
		if (count <= 0) {
			yield item;
		} else {
			count--;
		}
	}
}

@Frozen
@Immutable
class BasicIter<T> extends Iter<T> {
	constructor(private iter: Iterable<T>) {
		super();
	}

	protected iterable(): Iterable<T> {
		return this.iter;
	}
}

@Frozen
@Immutable
class TransformIter<I, O> extends Iter<O> {
	constructor(private iter: Iterable<I>, private transform: (iterable: Iterable<I>) => Iterator<O>) {
		super();
	}

	[Symbol.iterator](): Iterator<O> {
		return this.transform(this.iter);
	}

	protected iterable(): Iterable<O> {
		return this;
	}
}
