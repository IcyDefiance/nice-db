import { ISafeConnectionOptions } from "@state/conns";
import * as React from "react";
import { Container } from "react-bootstrap";
import { ModalConfirm } from "./modal-confirm";
import { ScreenChooseConn } from "./screens/choose-conn";
import { ScreenConnected } from "./screens/connected";

export function Root() {
	const [connection, setConnection] = React.useState<ISafeConnectionOptions | null>(null);

	return (
		<Container fluid className="mt-3">
			{connection ? <ScreenConnected config={connection} /> : <ScreenChooseConn onConnected={setConnection} />}
			<ModalConfirm />
		</Container>
	);
}
