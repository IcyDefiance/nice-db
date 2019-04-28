import * as React from "react";
import { Button, Card, Col, Container, Fade, Row } from "react-bootstrap";
import { useObservable } from "rxjs-hooks";
import { Icon } from "../icons/icon";
import { miDatabasePlus, miDelete } from "../icons/icons";
import { conns$, delConn$ } from "../state/conns";
import { confirm, ModalConfirm } from "./modal-confirm";
import { ModalConn, showModalConn } from "./modal-conn";

export function Root() {
	const conns = useObservable(() => conns$) || [];

	function handleDeleteClick(index: number) {
		confirm("Are you sure you want to delete this connection?", "Delete", "danger").subscribe(() =>
			delConn$(index).subscribe(),
		);
	}

	return (
		<Container fluid className="mt-3">
			<Row>
				<Col className="flex-grow-0">
					<Button variant="outline-secondary" onClick={showModalConn} className="text-nowrap">
						<Icon icon={miDatabasePlus} /> Add Connection
					</Button>
				</Col>
				<Col className="d-flex flex-wrap m-n2">
					{conns.map((conn, i) => (
						<Fade key={i} appear in>
							<Card style={{ width: "18rem" }} className="m-2">
								<Card.Body>
									<div className="position-relative">
										<Button
											variant="link"
											className="abs-top-right text-body p-1 m-n2"
											onClick={() => handleDeleteClick(i)}
										>
											<Icon icon={miDelete} />
										</Button>
									</div>
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

			<ModalConn />
			<ModalConfirm />
		</Container>
	);
}
