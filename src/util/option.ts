export interface IOption<T> {
	match<U>(matcher: IOptionMatcher<T, U>): U;
	unwrapOrElse(alt: () => T): T;
}

export class Some<T> implements IOption<T> {
	constructor(private val: T) {}

	match<U>(matcher: IOptionMatcher<T, U>): U {
		return matcher.some(this.val);
	}

	unwrapOrElse(alt: () => T): T {
		return this.val;
	}
}

export class None implements IOption<never> {
	match<U>(matcher: IOptionMatcher<never, U>): U {
		return matcher.none();
	}

	unwrapOrElse<T>(alt: () => T): T {
		return alt();
	}
}

export function some<T>(val: T) {
	return new Some(val);
}

export const none = new None();

export interface IOptionMatcher<T, U> {
	some: (val: T) => U;
	none: () => U;
}
