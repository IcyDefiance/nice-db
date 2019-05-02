export interface IResult<T, E> {
	isOk(): boolean;
	isErr(): boolean;
	map<U>(cb: (val: T) => U): IResult<U, E>;
	match<U>(matcher: IResultMatcher<T, E, U>): U;
	unwrap(): T;
	unwrapErr(): E;
}

export class Ok<T> implements IResult<T, never> {
	constructor(private val: T) {}

	isOk(): boolean {
		return true;
	}

	isErr(): boolean {
		return false;
	}

	map<U>(cb: (val: T) => U): IResult<U, never> {
		return ok(cb(this.val));
	}

	match<U>(matcher: IResultMatcher<T, never, U>): U {
		return matcher.ok(this.val);
	}

	unwrap(): T {
		return this.val;
	}

	unwrapErr(): never {
		throw new Error(`tried to call \`unwrapErr\` on an ok value`);
	}
}

export class Err<E> implements IResult<never, E> {
	constructor(private err: E) {}

	isOk(): boolean {
		return false;
	}

	isErr(): boolean {
		return true;
	}

	map(): IResult<never, E> {
		return this;
	}

	match<U>(matcher: IResultMatcher<never, E, U>): U {
		return matcher.err(this.err);
	}

	unwrap(): never {
		throw new Error(`tried to unwrap an error`);
	}

	unwrapErr(): E {
		return this.err;
	}
}

export function ok<T>(val: T) {
	return new Ok(val);
}

export function err<E>(val: E) {
	return new Err(val);
}

export interface IResultMatcher<T, E, U> {
	ok: (val: T) => U;
	err: (err: E) => U;
}
