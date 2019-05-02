import { iter } from "../util/iter";
import { err, IResult, ok } from "../util/result";
import { Slice, slice } from "../util/slice";

export type Parser<T> = (input: Slice) => ParserResult<T>;
export type ParserResult<T> = IResult<[Slice, T], ParserError>;

export function altComplete<T>(...parsers: Parser<T>[]): Parser<T> {
	return (input: Slice) =>
		iter(parsers)
			.map((parser) => parser(input))
			.filter((result) => result.isOk())
			.nth(0)
			.unwrapOrElse(() => err(ParserError.newError(input)));
}

export function many0<T>(parser: Parser<T>): Parser<T[]> {
	return (input) => {
		const ret: T[] = [];
		while (true) {
			const result = parser(input);

			if (result.isErr()) {
				if (result.unwrapErr().isIncomplete()) {
					return (result as unknown) as ParserResult<T[]>;
				}

				return ok([input, ret]);
			}

			const [rem, out] = result.unwrap();
			if (input.length === rem.length) {
				return err(ParserError.newFailure(input));
			}
			input = rem;
			ret.push(out);
		}
	};
}

export function map<O, P>(parser: Parser<O>, cb: (out: O) => P): Parser<P> {
	return (input) => parser(input).map(([rem, val]) => [rem, cb(val)]);
}

export function tag(text: string): Parser<Slice> {
	return (input: Slice) => {
		if (input.length < text.length && input.eq(slice(text, 0, input.length))) {
			return err(ParserError.newIncomplete(text.length - input.length));
		}

		const match = input.slice(0, text.length);
		if (match.eq(text)) {
			return ok([input.slice(text.length), match]);
		} else {
			return err(ParserError.newError(input));
		}
	};
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

console.log(tag("one")(slice("one two")));
