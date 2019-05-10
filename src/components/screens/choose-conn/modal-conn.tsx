import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
	LinearProgress,
	TextField,
} from "@material-ui/core";
import { addConn$ } from "@state/conns";
import { createConnection, QueryError } from "@util/mysql-rx";
import * as React from "react";
import { Subject } from "rxjs";
import { useObservable } from "rxjs-hooks";
import { finalize } from "rxjs/operators";
import { notify } from "../../notifications";

const showSubj = new Subject<boolean>();

export function showModalConn() {
	showSubj.next(true);
}

export function ModalConn() {
	const [host, setHost] = React.useState("localhost");
	const [port, setPort] = React.useState(3306);
	const [user, setUser] = React.useState("root");
	const [password, setPassword] = React.useState("");
	const [remember, setRemember] = React.useState(false);
	const [connecting, setConnecting] = React.useState(false);

	const show = useObservable(() => showSubj) || false;

	const config = () => ({ host, port, user, password });
	const handleHostChange = (event: React.ChangeEvent<HTMLInputElement>) => setHost(event.currentTarget.value!);
	const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setPort(Number(event.currentTarget.value!));
	const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => setUser(event.currentTarget.value!);
	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(event.currentTarget.value!);
	const handleRememberChange = () => setRemember(!remember);

	function hide() {
		setHost("localhost");
		setPort(3306);
		setUser("root");
		setPassword("");
		setRemember(false);
		showSubj.next(false);
	}

	function testConn() {
		setConnecting(true);
		const conn = createConnection(config());
		conn.connect$()
			.pipe(finalize(() => setConnecting(false)))
			.subscribe({
				next: () => {
					notify("Connected successfully");
					conn.destroy();
				},
				error: (err: QueryError) => notify(err.message),
			});
	}

	function save() {
		addConn$(config(), remember).subscribe();
		hide();
	}

	return (
		<Dialog open={show} onClose={hide} aria-labelledby="addconn-title">
			<DialogTitle id="addconn-title">Add Connection</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item>
						<TextField label="Host" value={host} onChange={handleHostChange} />
					</Grid>
					<Grid item>
						<TextField type="number" label="Port" value={port.toString()} onChange={handlePortChange} />
					</Grid>
					<Grid item>
						<TextField label="Username" value={user} onChange={handleUserChange} />
					</Grid>
					<Grid item>
						<TextField type="password" label="Password" onChange={handlePasswordChange} />
					</Grid>
					<Grid item>
						<FormControlLabel
							control={
								<Checkbox
									disabled={!password}
									checked={remember && !!password}
									onChange={handleRememberChange}
								/>
							}
							label="Remember password"
						/>
					</Grid>
				</Grid>
				{/* Passwords are stored securely using your operating system's keychain. */}
				<div className="mt-3">{connecting && <LinearProgress />}</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={testConn}>Test Connection</Button>
				<Button onClick={hide}>Close</Button>
				<Button color="primary" onClick={save}>
					Save Changes
				</Button>
			</DialogActions>
		</Dialog>
	);
}
