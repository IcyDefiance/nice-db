import * as React from "react";
import { Container } from "react-bootstrap";
import { ModalConfirm } from "./modal-confirm";
import { ScreenChooseConn } from "./screens/choose-conn";
import { ScreenConnected } from "./screens/connected";
import { ConnectionOptions } from "@util/mysql-rx";

export function Root() {
	const [connection, setConnection] = React.useState<ConnectionOptions | null>(null);

	return (
		<Container fluid className="mt-3">
			{connection ? <ScreenConnected /> : <ScreenChooseConn onConnected={setConnection} />}
			<ModalConfirm />
		</Container>
	);
}
