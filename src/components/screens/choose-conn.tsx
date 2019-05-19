import { Icon } from "@components/icons/icon";
import { miDatabasePlus, miDelete } from "@components/icons/icons";
import { confirm } from "@components/modal-confirm";
import Button from "@material/react-button";
import Card, { CardActionButtons, CardActionIcons, CardActions, CardPrimaryContent } from "@material/react-card";
import IconButton from "@material/react-icon-button";
import { Headline5 } from "@material/react-typography";
import { conns$, delConn$, ISafeConnectionOptions } from "@state/conns";
import * as React from "react";
import { useObservable } from "rxjs-hooks";
import { CardContent } from "../material/card";
import { LayoutGrid } from "../material/layout-grid";
import { ModalConn, showModalConn } from "./choose-conn/modal-conn";

export interface IScreenChooseConnProps {
	onConnected: (config: ISafeConnectionOptions) => void;
}

export function ScreenChooseConn({ onConnected }: IScreenChooseConnProps) {
	const conns = useObservable(() => conns$) || [];

	function onDeleteClick(index: number) {
		confirm("Are you sure you want to delete this connection?", "Delete", "danger").subscribe(() =>
			delConn$(index).subscribe(),
		);
	}

	return (
		<div className="m-2">
			<Button outlined icon={<Icon icon={miDatabasePlus} />} onClick={showModalConn}>
				Add Connection
			</Button>
			<div className="mt-2">
				<LayoutGrid>
					{conns.map((conn, i) => (
						<LayoutGrid.Cell key={i}>
							<Card>
								<CardPrimaryContent onClick={() => onConnected(conn)}>
									<CardContent>
										<Headline5 tag="div">
											{conn.host}:{conn.port}
										</Headline5>
										<b>User:</b> {conn.user}
									</CardContent>
								</CardPrimaryContent>
								<CardActions>
									<CardActionButtons>
										<Button onClick={() => onConnected(conn)}>Connect</Button>
									</CardActionButtons>
									<CardActionIcons>
										<IconButton aria-label="Delete connection" onClick={() => onDeleteClick(i)}>
											<Icon icon={miDelete} />
										</IconButton>
									</CardActionIcons>
								</CardActions>
							</Card>
						</LayoutGrid.Cell>
					))}
				</LayoutGrid>
			</div>
			<ModalConn />
		</div>
	);
}
