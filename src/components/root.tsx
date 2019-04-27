import * as React from "react";
import { Button, Card, Col, Container, Row, Fade } from "react-bootstrap";
import { useObservable } from "rxjs-hooks";
import { Icon } from "../icons/icon";
import { miDatabasePlus } from "../icons/icons";
import { conns$ } from "../state/conns";
import { ModalConn } from "./modal-conn";

export function Root() {
	const [loginVisible, setLoginVisible] = React.useState(false);
	const conns = useObservable(() => conns$) || [];

	return (
		<Container fluid className="mt-3">
			<Row>
				<Col className="flex-grow-0">
					<Button variant="outline-secondary" onClick={() => setLoginVisible(true)} className="text-nowrap">
						<Icon icon={miDatabasePlus} /> Add Connection
					</Button>
				</Col>
				<Col className="d-flex flex-wrap m-n2">
					{conns.map((conn, i) => (
						<Fade key={i} appear in>
							<Card style={{ width: "18rem" }} className="m-2">
								<Card.Body>
									<Card.Title>
										{conn.host}:{conn.port}
									</Card.Title>
									<b>User:</b> {conn.user}
								</Card.Body>
							</Card>
						</Fade>
					))}
				</Col>
			</Row>

			<ModalConn show={loginVisible} onHide={() => setLoginVisible(false)} />
		</Container>
	);
}
