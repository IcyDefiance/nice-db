import Button from "@material/react-button";
import Checkbox from "@material/react-checkbox";
import Dialog, { DialogContent, DialogFooter, DialogTitle } from "@material/react-dialog";
import { Cell, Grid, Row } from "@material/react-layout-grid";
import LinearProgress from "@material/react-linear-progress";
import TextField, { Input } from "@material/react-text-field";
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
		<Dialog open={show} onClose={hide}>
			<DialogTitle>Add Connection</DialogTitle>
			<DialogContent>
				<Grid className="p-0">
					<Row>
						<Cell phoneColumns={4} tabletColumns={8} desktopColumns={6}>
							<TextField label="Host">
								<Input value={host} onChange={handleHostChange} />
							</TextField>
						</Cell>
						<Cell phoneColumns={4} tabletColumns={8} desktopColumns={6}>
							<TextField label="Port">
								<Input type="number" value={port.toString()} onChange={handlePortChange} />
							</TextField>
						</Cell>
					</Row>
					<Row className="mt-2">
						<Cell phoneColumns={4} tabletColumns={8} desktopColumns={6}>
							<TextField label="Username">
								<Input value={user} onChange={handleUserChange} />
							</TextField>
						</Cell>
						<Cell phoneColumns={4} tabletColumns={8} desktopColumns={6}>
							<TextField label="Password">
								<Input type="password" value={password} onChange={handlePasswordChange} />
							</TextField>
						</Cell>
					</Row>
					<Row className="mt-2">
						<Cell columns={12}>
							<div className="mdc-form-field">
								<Checkbox
									nativeControlId="remember"
									disabled={!password}
									checked={remember && !!password}
									onChange={handleRememberChange}
								/>
								<label htmlFor="remember">Remember password</label>
							</div>
						</Cell>
					</Row>
				</Grid>
				{/* Passwords are stored securely using your operating system's keychain. */}
				<div className="mt-3">{connecting && <LinearProgress indeterminate />}</div>
			</DialogContent>
			<DialogFooter>
				<Button onClick={testConn}>Test Connection</Button>
				<Button onClick={hide}>Close</Button>
				<Button onClick={save}>Save Changes</Button>
			</DialogFooter>
		</Dialog>
	);
}
