import * as React from "react";
import styled from "styled-components";
import { IIconDefinition } from "./icons";

export interface IIconProps {
	className?: string;
	icon: IIconDefinition;
}

const StyledSvg = styled.svg`
	width: 1em;
`;

export function Icon({ className, icon }: IIconProps) {
	return (
		<StyledSvg className={className} viewBox="0 0 24 24">
			<path fill="currentColor" d={icon.path} />
		</StyledSvg>
	);
}
