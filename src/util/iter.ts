import { Frozen, Immutable } from "./decorators";

export function iter<T>(iterable: Iterable<T>): Iter<T> {
	return new BasicIter(iterable);
}

@Frozen
export abstract class Iter<T> implements Iterable<T> {
	protected abstract iterable(): Iterable<T>;

	enumerate() {
		return new TransformIter(this.iterable(), enumerate);
	}

	map<U>(cb: (item: T) => U) {
		return new TransformIter(this.iterable(), (iter) => map(iter, cb));
	}

	[Symbol.iterator](): Iterator<T> {
		return this.iterable()[Symbol.iterator]();
	}
}

function* enumerate<T>(iter: Iterable<T>): IterableIterator<[number, T]> {
	let i = 0;
	for (const item of iter) {
		yield [i, item];
		i++;
	}
}

function* map<T, U>(iter: Iterable<T>, cb: (item: T) => U): Iterator<U> {
	for (const item of iter) {
		yield cb(item);
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
