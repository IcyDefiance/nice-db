import * as React from "react";
import { IIconDefinition } from "@components/icons/icons";
import { Icon } from "@components/icons/icon";
import { MDCRipple } from "@material/ripple";

export interface IButtonProps {
	children?: React.ReactNode;
	dense?: boolean;
	icon?: IIconDefinition;
	iconAfter?: IIconDefinition;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	variant?: "raised" | "unelevated" | "outlined";
}

export function Button(props: IButtonProps) {
	const classes = ["mdc-button"];
	props.variant && classes.push(`mdc-button--${props.variant}`);
	props.dense && classes.push("mdc-button--dense");

	return (
		<button ref={(el) => el && MDCRipple.attachTo(el)} className={classes.join(" ")} onClick={props.onClick}>
			{props.icon && <Icon icon={props.icon} className="mdc-button__icon" />}
			<span className="mdc-button__label">{props.children}</span>
			{props.iconAfter && <Icon icon={props.iconAfter} className="mdc-button__icon" />}
		</button>
	);
}
