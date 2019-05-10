import * as React from "react";
import { Subject } from "rxjs";
import { useObservable } from "rxjs-hooks";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

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

	function hide() {
		confirmSubj!.complete();
		showSubj.next(false);
	}

	function okay() {
		confirmSubj!.next();
		confirmSubj!.complete();
		hide();
	}

	return (
		<Dialog open={show} onClose={hide} aria-labelledby="confirm-title" aria-describedby="confirm-desc">
			<DialogTitle id="confirm-title">Please Confirm</DialogTitle>
			<DialogContent>
				<DialogContentText id="confirm-desc">{opts.msg}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={hide}>Cancel</Button>
				<Button onClick={okay} color="secondary">
					{opts.confirmText || "Okay"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
