import Dialog, { DialogButton, DialogContent, DialogFooter, DialogTitle } from "@material/react-dialog";
import * as React from "react";
import { Subject } from "rxjs";
import { useObservable } from "rxjs-hooks";

type ButtonVariants =
	| "primary"
	| "secondary"
	| "success"
	| "danger"
	| "warning"
	| "info"
	| "dark"
	| "light"
	| "link"
	| "outline-primary"
	| "outline-secondary"
	| "outline-success"
	| "outline-danger"
	| "outline-warning"
	| "outline-info"
	| "outline-dark"
	| "outline-light";

interface IOpts {
	msg: string;
	confirmText?: string;
	variant?: ButtonVariants;
}

const optsSubj = new Subject<IOpts | null>();
const showSubj = new Subject<boolean>();
let confirmSubj: Subject<void> | null = null;

export function confirm(msg: string, confirmText?: string, variant?: ButtonVariants): Subject<void> {
	optsSubj.next({ msg, confirmText, variant });
	showSubj.next(true);
	confirmSubj = new Subject();
	return confirmSubj;
}

export function ModalConfirm() {
	const opts = useObservable(() => optsSubj) || { msg: "" };
	const show = useObservable(() => showSubj) || false;

	function hide(action: string) {
		if (action === "ok") {
			confirmSubj!.next();
		}
		confirmSubj!.complete();
		showSubj.next(false);
	}

	return (
		<Dialog open={show} onClose={hide} aria-labelledby="confirm-title" aria-describedby="confirm-desc">
			<DialogTitle>Please Confirm</DialogTitle>
			<DialogContent>{opts.msg}</DialogContent>
			<DialogFooter>
				<DialogButton action="cancel">Cancel</DialogButton>
				<DialogButton action="ok">{opts.confirmText || "Okay"}</DialogButton>
			</DialogFooter>
		</Dialog>
	);
}
