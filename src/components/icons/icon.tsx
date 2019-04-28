import * as React from "react";
import styled from "styled-components";
import { IIconDefinition } from "./icons";

export interface IIconProps {
	className?: string;
	icon: IIconDefinition;
}

const StyledIcon = styled.svg`
	width: 1em;
`;

export function Icon({ className, icon }: IIconProps) {
	return (
		<StyledIcon className={className} viewBox="0 0 24 24">
			<path fill="currentColor" d={icon.path} />
		</StyledIcon>
	);
}
