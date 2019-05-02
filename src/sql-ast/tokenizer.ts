import { altComplete, map, Parser, tag, many0, ParserResult } from "../parser/parser";
import { Slice, slice } from "../util/slice";
import { keywords } from "./keywords";

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
