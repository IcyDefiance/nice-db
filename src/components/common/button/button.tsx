import { Icon } from "@components/icons/icon";
import { IIconDefinition } from "@components/icons/icons";
import { MDCRipple } from "@material/ripple";
import * as React from "react";
import "./button.scss";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	dense?: boolean;
	icon?: IIconDefinition;
	iconAfter?: IIconDefinition;
	variant?: "raised" | "unelevated" | "outlined";
}

export function Button(props: IButtonProps) {
	const classes = ["mdc-button"];
	props.variant && classes.push(`mdc-button--${props.variant}`);
	props.dense && classes.push("mdc-button--dense");
	props.className && classes.push(props.className);

	return (
		<button {...props} ref={(el) => el && MDCRipple.attachTo(el)} className={classes.join(" ")}>
			{props.icon && <Icon icon={props.icon} className="mdc-button__icon" />}
			<span className="mdc-button__label">{props.children}</span>
			{props.iconAfter && <Icon icon={props.iconAfter} className="mdc-button__icon" />}
		</button>
	);
}
