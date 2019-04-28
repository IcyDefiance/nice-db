import { AButton } from "@components/a-button";
import { Icon } from "@components/icons/icon";
import { miDatabasePlus, miDelete } from "@components/icons/icons";
import { confirm } from "@components/modal-confirm";
import { conns$, delConn$ } from "@state/conns";
import * as React from "react";
import { Button, Card, Col, Fade, Row } from "react-bootstrap";
import { useObservable } from "rxjs-hooks";
import { ModalConn, showModalConn } from "./choose-conn/modal-conn";

export function ScreenChooseConn() {
	const conns = useObservable(() => conns$) || [];

	function handleDeleteClick(index: number) {
		confirm("Are you sure you want to delete this connection?", "Delete", "danger").subscribe(() =>
			delConn$(index).subscribe(),
		);
	}

	return (
		<Row>
			<Col className="flex-grow-0">
				<Button variant="outline-secondary" onClick={showModalConn} className="text-nowrap">
					<Icon icon={miDatabasePlus} /> Add Connection
				</Button>
			</Col>
			<Col>
				<div className="d-flex flex-wrap m-n2">
					{conns.map((conn, i) => (
						<Fade key={i} appear in>
							<Card style={{ width: "18rem" }} className="m-2">
								<Card.Body>
									<div className="position-relative">
										<AButton
											className="abs-top-right text-body"
											onClick={() => handleDeleteClick(i)}
										>
											<Icon icon={miDelete} />
										</AButton>
									</div>
									<Card.Title>
										{conn.host}:{conn.port}
									</Card.Title>
									<b>User:</b> {conn.user}
								</Card.Body>
							</Card>
						</Fade>
					))}
				</div>
			</Col>
			<ModalConn />
		</Row>
	);
}
