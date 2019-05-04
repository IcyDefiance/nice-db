import { alphanum1, multispace1 } from "../parser/complete";
import { altComplete, many0, map, oneOf, verify } from "../parser/parser";
import { isDigit } from "../parser/util";
import { iter } from "../util/iter";
import { Slice, slice } from "../util/slice";
import { keywords } from "./keywords";

const keywordSet = new Set(Object.values(keywords));

const identUnquoted = map(verify(alphanum1, (val) => iter(val).any((ch) => !isDigit(ch))), (text) => ({
	type: keywordSet.has(text.toUpperCase()) ? TokenType.Keyword : TokenType.Ident,
	text,
}));
// TODO: support quoted idents
const ident = altComplete(identUnquoted);

const punctuation = map(oneOf(".,();"), (text) => ({ type: TokenType.Punctuation, text }));
const whitespace = map(multispace1, (text) => ({ type: TokenType.Whitespace, text }));

const token = altComplete(ident, punctuation, whitespace);
const tokens = many0(token);

export function tokenize(sql: string): { val: IToken[]; rem: Slice } {
	return tokens(slice(sql)).unwrap();
}

export interface IToken {
	type: TokenType;
	text: Slice;
}

export enum TokenType {
	Ident = "ident",
	Keyword = "keyword",
	Punctuation = "punctuation",
	Whitespace = "whitespace",
}
