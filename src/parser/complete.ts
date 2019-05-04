import { Slice } from "../util/slice";
import { Parser, takeWhile1 } from "./parser";
import { isAlpha, isAlphanum } from "./util";

export const alpha1: Parser<Slice> = takeWhile1((ch) => isAlpha(ch));
export const alphanum1: Parser<Slice> = takeWhile1((ch) => isAlphanum(ch));
