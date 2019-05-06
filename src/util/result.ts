import { Frozen, Immutable } from "./decorators";

export interface IResult<T, E> {
	andThen<U>(cb: (val: T) => IResult<U, E>): IResult<U, E>;
	isOk(): boolean;
	isErr(): boolean;
	map<U>(cb: (val: T) => U): IResult<U, E>;
	mapErr<U>(cb: (val: E) => U): IResult<T, U>;
	match<U>(matcher: IResultMatcher<T, E, U>): U;
	unwrap(): T;
	unwrapErr(): E;
}

@Frozen
@Immutable
export class Ok<T> implements IResult<T, never> {
	constructor(private val: T) {}

	andThen<U>(cb: (val: T) => IResult<U, never>): IResult<U, never> {
		return cb(this.val);
	}

	isOk(): boolean {
		return true;
	}

	isErr(): boolean {
		return false;
	}

	map<U>(cb: (val: T) => U): Ok<U> {
		return ok(cb(this.val));
	}

	mapErr(): Ok<T> {
		return this;
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

@Frozen
@Immutable
export class Err<E> implements IResult<never, E> {
	constructor(private err: E) {}

	andThen(): Err<E> {
		return this;
	}

	isOk(): boolean {
		return false;
	}

	isErr(): boolean {
		return true;
	}

	map(): Err<E> {
		return this;
	}

	mapErr<U>(cb: (val: E) => U): Err<U> {
		return err(cb(this.err));
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
