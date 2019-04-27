import * as React from "react";
import styled from "styled-components";
import { IIconDefinition, SvgElType } from "./types";

export interface IIconProps {
	icon: IIconDefinition;
}

const StyledIcon = styled.svg`
	width: 1em;
`;

export function Icon(props: IIconProps) {
	const viewBox = `0 0 ${props.icon.dims[0]} ${props.icon.dims[1]}`;

	return (
		<StyledIcon viewBox={viewBox}>
			{props.icon.els.map((el, i) => {
				switch (el.type) {
					case SvgElType.Path:
						return <path fill="currentColor" d={el.d} key={i} />;
				}
			})}
		</StyledIcon>
	);
}
