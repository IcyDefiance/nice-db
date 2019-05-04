import { iter } from "../util/iter";
import { err, IResult, ok } from "../util/result";
import { Slice, slice } from "../util/slice";

export type Parser<T> = (input: Slice) => ParserResult<T>;
export type ParserOk<T> = { val: T; rem: Slice; inc: boolean };
export type ParserResult<T> = IResult<ParserOk<T>, ParserError>;

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
		const val: T[] = [];
		while (true) {
			const result = parser(input);

			if (result.isErr()) {
				return ok({ val, rem: input, inc: result.unwrapErr().isIncomplete() });
			}

			const { rem, val: out } = result.unwrap();
			if (input.length === rem.length) {
				return err(ParserError.newFailure(input));
			}
			input = rem;
			val.push(out);
		}
	};
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

export function tag(text: string): Parser<Slice> {
	return (input: Slice) => {
		if (input.length < text.length && input.eq(slice(text, 0, input.length))) {
			return err(ParserError.newIncomplete(text.length - input.length));
		}

		const val = input.slice(0, text.length);
		if (val.eq(text)) {
			return ok({ val, rem: input.slice(text.length), inc: false });
		} else {
			return err(ParserError.newError(input));
		}
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
		const inc = !rem.length;
		return ok({ val: input.slice(0, len), rem, inc });
	};
}

export function takeWhile1(cb: (ch: string) => boolean): Parser<Slice> {
	return verify(takeWhile(cb), (out) => !!out.length);
}

export function verify<O>(parser: Parser<O>, cb: (out: O) => boolean): Parser<O> {
	return (input) =>
		parser(input).andThen((res) => {
			if (cb(res.val)) {
				return ok(res);
			} else {
				return err(ParserError.newError(input));
			}
		});
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
