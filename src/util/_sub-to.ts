import { Subscriber } from "rxjs";

export function subToCb<T, E>(subscriber: Subscriber<T>) {
	return (err: E, data?: T) => {
		if (err) {
			subscriber.error(err);
		} else {
			subscriber.next(data);
			subscriber.complete();
		}
	};
}
