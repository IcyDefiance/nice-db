import { Icon } from "@components/icons/icon";
import { miDatabasePlus, miDelete } from "@components/icons/icons";
import { confirm } from "@components/modal-confirm";
import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	Fade,
	Grid,
	IconButton,
	Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { conns$, delConn$, ISafeConnectionOptions } from "@state/conns";
import * as React from "react";
import { useObservable } from "rxjs-hooks";
import { ModalConn, showModalConn } from "./choose-conn/modal-conn";

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
			<Button variant="outlined" onClick={showModalConn} className="text-nowrap">
				<Icon icon={miDatabasePlus} /> Add Connection
			</Button>
			<Box mt={2}>
				<Grid container spacing={2}>
					{conns.map((conn, i) => (
						<Grid item key={i}>
							<Fade in>
								<Card style={{ width: "18rem" }}>
									<CardActionArea onClick={() => onConnected(conn)}>
										<CardContent>
											<Typography variant="h5" gutterBottom>
												{conn.host}:{conn.port}
											</Typography>
											<b>User:</b> {conn.user}
										</CardContent>
									</CardActionArea>
									<CardActions>
										<Button size="small" color="primary" onClick={() => onConnected(conn)}>
											Connect
										</Button>
										<IconButton
											aria-label="Delete connection"
											onClick={() => handleDeleteClick(i)}
											style={{ marginLeft: "auto" }}
										>
											<Icon icon={miDelete} />
										</IconButton>
									</CardActions>
								</Card>
							</Fade>
						</Grid>
					))}
				</Grid>
			</Box>
			<ModalConn />
		</Box>
	);
}
