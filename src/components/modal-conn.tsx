import * as React from "react";
import { Alert, Button, Col, Form, FormControlProps, Modal, ProgressBar } from "react-bootstrap";
import { finalize } from "rxjs/operators";
import { addConnection } from "../state/conns";
import * as mysql from "../util/mysql-rx";

interface IModalConnProps {
	show?: boolean;
	onHide?: () => void;
}

export function ModalConn(props: IModalConnProps) {
	const [host, setHost] = React.useState("localhost");
	const [port, setPort] = React.useState(3306);
	const [user, setUser] = React.useState("root");
	const [password, setPassword] = React.useState("");
	const [connecting, setConnecting] = React.useState(false);
	const [connTest, setConnTest] = React.useState<{ err: string | null } | null>(null);

	const handleHostChange = (event: React.FormEvent<FormControlProps>) => setHost(event.currentTarget.value!);
	const handlePortChange = (event: React.FormEvent<FormControlProps>) => setPort(Number(event.currentTarget.value!));
	const handleUserChange = (event: React.FormEvent<FormControlProps>) => setUser(event.currentTarget.value!);
	const handlePasswordChange = (event: React.FormEvent<FormControlProps>) => setPassword(event.currentTarget.value!);
	const config = () => ({ host, port, user, password });

	function testConn() {
		setConnecting(true);
		setConnTest(null);
		const conn = mysql.createConnection(config());
		conn.connect()
			.pipe(finalize(() => setConnecting(false)))
			.subscribe({
				next: () => {
					setConnTest({ err: null });
					conn.destroy();
				},
				error: (err: mysql.QueryError) => setConnTest({ err: err.message }),
			});
	}

	function save() {
		addConnection(config()).subscribe(() => {
			if (props.onHide) {
				props.onHide();
			}
		});
	}

	return (
		<Modal show={props.show} onHide={props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Add Connection</Modal.Title>
			</Modal.Header>
			<Form>
				<Modal.Body>
					<span className="text-danger">
						WARNING: Passwords are currently stored in a file as plain text. Don't type anything important
						in that field yet.
					</span>
					<Form.Row>
						<Col>
							<Form.Group>
								<Form.Label>Host</Form.Label>
								<Form.Control value={host} onChange={handleHostChange} />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Port</Form.Label>
								<Form.Control type="number" value={port.toString()} onChange={handlePortChange} />
							</Form.Group>
						</Col>
					</Form.Row>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control value={user} onChange={handleUserChange} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" onChange={handlePasswordChange} />
					</Form.Group>

					{connecting && <ProgressBar animated now={100} label="Connecting..." srOnly />}
					{connTest && (
						<Alert variant={connTest.err ? "danger" : "success"}>
							{connTest.err || "Connected successfully"}
						</Alert>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={testConn}>
						Test Connection
					</Button>
					<Button variant="secondary" onClick={props.onHide}>
						Close
					</Button>
					<Button variant="primary" onClick={save}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}
