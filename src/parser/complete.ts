import { Slice } from "../util/slice";
import { Parser, takeWhile1 } from "./parser";
import { isAlpha, isAlphanum } from "./util";

const multispaceChars = new Set(" \t\n\r");

export const alpha1: Parser<Slice> = takeWhile1((ch) => isAlpha(ch));
export const alphanum1: Parser<Slice> = takeWhile1((ch) => isAlphanum(ch));
export const multispace1: Parser<Slice> = takeWhile1((ch) => multispaceChars.has(ch));
