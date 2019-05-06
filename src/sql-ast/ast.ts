import { IOption, none, some } from "../util/option";
import { err, IResult } from "../util/result";
import { SliceArr } from "../util/slice";
import { IToken, TokenType } from "./tokenizer";
import { tuple } from "../util/tuple";

export function select(tokens: SliceArr<IToken>): IResult<void, string | null> {
	const tokensRef = tuple(tokens);

	let result = keyword(tokensRef, "SELECT");
	if (result.isNone()) {
		return err(null);
	}
}

function keyword(tokens: [SliceArr<IToken>], text: string): IOption<IToken> {
	const next = tokens[0].get(0);
	if (next.type === TokenType.Keyword && next.text.toUpperCase() === text) {
		tokens[0] = tokens[0].slice(1);
		return some(next);
	} else {
		return none;
	}
}
