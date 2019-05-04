import { alphanum1 } from "../parser/complete";
import { altComplete, many0, map, Parser, ParserResult, verify } from "../parser/parser";
import { Slice, slice } from "../util/slice";
import { keywords } from "./keywords";

const ident = verify(alphanum1, (val) => !isNaN(Number(val.toString())));
const keyword: Parser<ITokenKeyword> = map(altComplete(...Object.values(keywords)), (text) => ({
	type: TokenType.Keyword,
	text,
}));

const token = altComplete(keyword);
const tokens = many0(token);

export function tokenize(sql: string): ParserResult<Token[]> {
	return tokens(slice(sql));
}

export type Token = ITokenKeyword;

export interface ITokenKeyword {
	type: TokenType.Keyword;
	text: Slice;
}

export enum TokenType {
	Keyword,
}
