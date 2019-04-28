import * as React from "react";
import styled from "styled-components";
import { IIconDefinition, SvgElType } from "./types";

export interface IIconProps {
	className?: string;
	icon: IIconDefinition;
}

const StyledIcon = styled.svg`
	width: 1em;
`;

export function Icon({ className, icon }: IIconProps) {
	const viewBox = `0 0 ${icon.dims[0]} ${icon.dims[1]}`;

	return (
		<StyledIcon className={className} viewBox={viewBox}>
			{icon.els.map((el, i) => {
				switch (el.type) {
					case SvgElType.Path:
						return <path fill="currentColor" d={el.d} key={i} />;
				}
			})}
		</StyledIcon>
	);
}
