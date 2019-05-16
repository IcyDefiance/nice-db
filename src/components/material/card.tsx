import { MDCRipple } from "@material/ripple";
import * as React from "react";
import styled from "styled-components";
import classNames from "classnames";

export function Card(props: React.ButtonHTMLAttributes<HTMLDivElement>) {
	let className = "mdc-card";
	props.className && (className += ` ${props.className}`);

	return <div {...props} className={className} />;
}

Card.PrimaryAction = (props: React.ButtonHTMLAttributes<HTMLDivElement>) => {
	let className = "mdc-card__primary-action";
	props.className && (className += ` ${props.className}`);

	return (
		<div {...props} ref={(el) => el && MDCRipple.attachTo(el)} role="button" className={className} tabIndex={0} />
	);
};

export interface ICardActionsProps {
	buttons?: JSX.Element[];
	icons?: JSX.Element[];
}
Card.Actions = ({ buttons, icons }: ICardActionsProps) => {
	if (buttons) {
		buttons = buttons.map((button, key) =>
			React.cloneElement(button, {
				...button.props,
				className: classNames(button.props.className, "mdc-card__action mdc-card__action--button"),
				key,
			}),
		);
	}
	if (icons) {
		icons = icons.map((button, key) =>
			React.cloneElement(button, {
				...button.props,
				className: classNames(button.props.className, "mdc-card__action mdc-card__action--icon"),
				key,
			}),
		);
	}

	return (
		<div className="mdc-card__actions">
			{buttons && <div className="mdc-card__action-buttons">{buttons}</div>}
			{icons && <div className="mdc-card__action-icons">{icons}</div>}
		</div>
	);
};

function Content(props: React.ButtonHTMLAttributes<HTMLDivElement>) {
	return <div {...props} />;
}
export const CardContent = styled(Content)`
	padding: 16px;
`;
