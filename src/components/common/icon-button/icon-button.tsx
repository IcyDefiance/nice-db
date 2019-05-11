import { Icon } from "@components/icons/icon";
import { IIconDefinition } from "@components/icons/icons";
import { MDCRipple } from "@material/ripple";
import * as React from "react";
import "./icon-button.scss";

export interface IIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: IIconDefinition;
}

export function IconButton(props: IIconButtonProps) {
	let className = "mdc-icon-button";
	props.className && (className += ` ${props.className}`);

	return (
		<button {...props} ref={(el) => el && MDCRipple.attachTo(el, { isUnbounded: true })} className={className}>
			<Icon icon={props.icon} />
		</button>
	);
}
