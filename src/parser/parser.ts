import { iter } from "../util/iter";
import { err, Err, IResult, ok } from "../util/result";
import { Slice, slice } from "../util/slice";

export type Parser<T> = (input: Slice) => ParserResult<T>;
export type ParserResult<T> = IResult<{ val: T; rem: Slice }, ParserError>;

export function altComplete<T>(...parsers: Parser<T>[]): Parser<T> {
	return (input: Slice) =>
		iter(parsers)
			.map((parser) => parser(input))
			.filter((result) => result.isOk())
			.nth(0)
			.unwrapOrElse(() => error(input));
}

export function many0<T>(parser: Parser<T>): Parser<T[]> {
	return (input) => {
		const val: T[] = [];
		while (!!input.length) {
			const result = parser(input);

			if (result.isErr()) {
				break;
			}

			const { rem, val: out } = result.unwrap();
			if (input.length === rem.length) {
				return error(input);
			}
			input = rem;
			val.push(out);
		}
		return success(input, val);
	};
}

export function many1<T>(parser: Parser<T>): Parser<T[]> {
	return verify(many0(parser), (out) => !!out.length);
}

export function map<O, P>(parser: Parser<O>, cb: (out: O) => P): Parser<P> {
	return (input) => parser(input).map(({ val, ...props }) => ({ val: cb(val), ...props }));
}

export function mapRes<O, P>(parser: Parser<O>, cb: (out: O) => IResult<P, any>): Parser<P> {
	return (input) =>
		parser(input).andThen(({ val, ...props }) =>
			cb(val)
				.map((nval) => ({ val: nval, ...props }))
				.mapErr(() => ParserError.newError(input)),
		);
}

export function oneOf(chars: string, complete: boolean = true): Parser<Slice> {
	const set = new Set(chars);
	return (input: Slice) =>
		set.has(input.get(0)) ? success(input.slice(1), input.slice(0, 1)) : maybeIncomplete(complete, input, 1);
}

export function tag(text: string, complete: boolean = true): Parser<Slice> {
	return (input: Slice) => {
		if (input.length < text.length && input.eq(slice(text, 0, input.length))) {
			return maybeIncomplete(complete, input, text.length - input.length);
		}

		const val = input.slice(0, text.length);
		return val.eq(text) ? success(input.slice(text.length), val) : error(input);
	};
}

export function takeWhile(cb: (ch: string) => boolean): Parser<Slice> {
	return (input: Slice) => {
		let rem = input.slice();
		let len = 0;
		while (rem.length && cb(rem.get(0))) {
			++len;
			rem = rem.slice(1);
		}
		return success(rem, input.slice(0, len));
	};
}

export function takeWhile1(cb: (ch: string) => boolean): Parser<Slice> {
	return verify(takeWhile(cb), (out) => !!out.length);
}

export function verify<O>(parser: Parser<O>, cb: (out: O) => boolean): Parser<O> {
	return (input) => parser(input).andThen((res) => (cb(res.val) ? ok(res) : error(input)));
}

export class ParserError {
	private info: ParserErrorInfo = { kind: ErrKind.Incomplete };

	static newIncomplete(needed?: number): ParserError {
		const ret = new ParserError();
		ret.info = { kind: ErrKind.Incomplete, needed };
		return ret;
	}

	static newError(input?: Slice): ParserError {
		const ret = new ParserError();
		ret.info = { kind: ErrKind.Error, input };
		return ret;
	}

	static newFailure(input?: Slice): ParserError {
		const ret = new ParserError();
		ret.info = { kind: ErrKind.Failure, input };
		return ret;
	}

	constructor() {}

	isIncomplete(): boolean {
		return this.info.kind === ErrKind.Incomplete;
	}

	isError(): boolean {
		return this.info.kind === ErrKind.Error;
	}

	isFailure(): boolean {
		return this.info.kind === ErrKind.Failure;
	}
}

function success<T>(rem: Slice, val: T) {
	return ok({ rem, val });
}

function error(input: Slice): Err<ParserError> {
	return err(ParserError.newError(input));
}

function maybeIncomplete(complete: boolean, input: Slice, needed?: number): Err<ParserError> {
	return err(complete ? ParserError.newError(input) : ParserError.newIncomplete(needed));
}

enum ErrKind {
	Incomplete,
	Error,
	Failure,
}

type ParserErrorInfo = ParserErrorIncomplete | ParserErrorError | ParserErrorFailure;

interface ParserErrorIncomplete {
	kind: ErrKind.Incomplete;
	needed?: number;
}

interface ParserErrorError {
	kind: ErrKind.Error;
	input?: Slice;
}

interface ParserErrorFailure {
	kind: ErrKind.Failure;
	input?: Slice;
}
