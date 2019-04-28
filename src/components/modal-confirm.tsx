import * as React from "react";
import { Button, Modal } from "react-bootstrap";
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

	function hide() {
		confirmSubj!.complete();
		showSubj.next(false);
	}

	function okay() {
		confirmSubj!.next();
		hide();
	}

	return (
		<Modal show={show} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>Please Confirm</Modal.Title>
			</Modal.Header>
			<Modal.Body>{opts.msg}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={hide}>
					Cancel
				</Button>
				<Button variant={opts.variant || "primary"} onClick={okay}>
					{opts.confirmText || "Okay"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
