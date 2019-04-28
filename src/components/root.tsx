import * as React from "react";
import { Container } from "react-bootstrap";
import { ModalConfirm } from "./modal-confirm";
import { ScreenChooseConn } from "./screens/choose-conn";

export function Root() {
	return (
		<Container fluid className="mt-3">
			<ScreenChooseConn />
			<ModalConfirm />
		</Container>
	);
}
