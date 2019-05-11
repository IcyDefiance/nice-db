import { miDatabasePlus, miDelete } from "@components/icons/icons";
import { confirm } from "@components/modal-confirm";
import { Fade, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { conns$, delConn$, ISafeConnectionOptions } from "@state/conns";
import * as React from "react";
import { useObservable } from "rxjs-hooks";
import { Button } from "../common/button/button";
import { IconButton } from "../common/icon-button/icon-button";
import { LayoutGrid } from "../common/layout-grid/layout-grid";
import { ModalConn, showModalConn } from "./choose-conn/modal-conn";
import { Card } from "../common/card/card";

export interface IScreenChooseConnProps {
	onConnected: (config: ISafeConnectionOptions) => void;
}

export function ScreenChooseConn({ onConnected }: IScreenChooseConnProps) {
	const conns = useObservable(() => conns$) || [];

	function handleDeleteClick(index: number) {
		confirm("Are you sure you want to delete this connection?", "Delete", "danger").subscribe(() =>
			delConn$(index).subscribe(),
		);
	}

	return (
		<Box m={2}>
			<Button variant="outlined" icon={miDatabasePlus} onClick={showModalConn}>
				Add Connection
			</Button>
			<Box mt={2}>
				<LayoutGrid>
					{conns.map((conn, i) => (
						<LayoutGrid.Cell key={i}>
							<Fade in>
								<Card style={{ width: "18rem" }}>
									<Card.PrimaryAction onClick={() => onConnected(conn)}>
										<Card.Content>
											<Typography variant="h5" gutterBottom>
												{conn.host}:{conn.port}
											</Typography>
											<b>User:</b> {conn.user}
										</Card.Content>
									</Card.PrimaryAction>
									<Card.Actions
										buttons={[<Button onClick={() => onConnected(conn)}>Connect</Button>]}
										icons={[
											<IconButton
												aria-label="Delete connection"
												onClick={() => handleDeleteClick(i)}
												style={{ marginLeft: "auto" }}
												icon={miDelete}
											/>,
										]}
									/>
								</Card>
							</Fade>
						</LayoutGrid.Cell>
					))}
				</LayoutGrid>
			</Box>
			<ModalConn />
		</Box>
	);
}
