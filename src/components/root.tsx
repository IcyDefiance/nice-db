import { CssBaseline } from "@material-ui/core";
import { ISafeConnectionOptions } from "@state/conns";
import * as React from "react";
import { ModalConfirm } from "./modal-confirm";
import { ScreenChooseConn } from "./screens/choose-conn";
import { ScreenConnected } from "./screens/connected";
import { Notifications } from "./notifications";

export function Root() {
	const [connection, setConnection] = React.useState<ISafeConnectionOptions | null>(null);

	return (
		<>
			<CssBaseline />
			<Notifications />
			<ModalConfirm />
			{connection ? <ScreenConnected config={connection} /> : <ScreenChooseConn onConnected={setConnection} />}
		</>
	);
}
