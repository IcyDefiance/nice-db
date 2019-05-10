import { Snackbar } from "@material-ui/core";
import * as React from "react";
import { BehaviorSubject } from "rxjs";
import { useObservable } from "rxjs-hooks";
import { tuple } from "../util/tuple";

const notificationsBS = new BehaviorSubject<[string | null, string | null, string | null]>([null, null, null]);

export function notify(msg: string) {
	const cur = notificationsBS.value;
	notificationsBS.next([cur[0], cur[1], msg]);
}

export function Notifications() {
	const notifications = useObservable(() => notificationsBS);

	function handleClose(idx: number) {
		const clone = tuple(...notificationsBS.value);
		clone[idx] = null;
		notificationsBS.next(clone);
	}

	return (
		<>
			{notifications &&
				notifications.map((notification, i) => (
					<Snackbar
						key={i}
						open={!!notification}
						autoHideDuration={5000}
						onClose={() => handleClose(i)}
						message={notification}
					/>
				))}
		</>
	);
}
