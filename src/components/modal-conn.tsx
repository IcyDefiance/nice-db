import * as React from "react";
import { Alert, Button, Col, Form, FormControlProps, Modal, ProgressBar } from "react-bootstrap";
import { Subject } from "rxjs";
import { useObservable } from "rxjs-hooks";
import { finalize } from "rxjs/operators";
import { addConn$ } from "../state/conns";
import * as mysql from "../util/mysql-rx";

const showSubj = new Subject<boolean>();

export function showModalConn() {
	showSubj.next(true);
}

export function ModalConn() {
	const [host, setHost] = React.useState("localhost");
	const [port, setPort] = React.useState(3306);
	const [user, setUser] = React.useState("root");
	const [password, setPassword] = React.useState("");
	const [connecting, setConnecting] = React.useState(false);
	const [connTest, setConnTest] = React.useState<{ err: string | null } | null>(null);

	const show = useObservable(() => showSubj) || false;

	const config = () => ({ host, port, user, password });
	const handleHostChange = (event: React.FormEvent<FormControlProps>) => setHost(event.currentTarget.value!);
	const handlePortChange = (event: React.FormEvent<FormControlProps>) => setPort(Number(event.currentTarget.value!));
	const handleUserChange = (event: React.FormEvent<FormControlProps>) => setUser(event.currentTarget.value!);
	const handlePasswordChange = (event: React.FormEvent<FormControlProps>) => setPassword(event.currentTarget.value!);
	const hide = () => showSubj.next(false);

	function testConn() {
		setConnecting(true);
		setConnTest(null);
		const conn = mysql.createConnection(config());
		conn.connect$()
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
		addConn$(config()).subscribe();
		hide();
	}

	return (
		<Modal show={show} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>Add Connection</Modal.Title>
			</Modal.Header>
			<Form>
				<Modal.Body>
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
					<Button variant="secondary" onClick={hide}>
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
