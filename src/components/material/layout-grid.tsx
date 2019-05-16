import * as React from "react";

export interface IGridProps {
	children?: React.ReactNode;
}

export interface ICellProps {
	children?: React.ReactNode;
}

export function LayoutGrid({ children }: IGridProps) {
	return (
		<div className="mdc-layout-grid">
			<div className="mdc-layout-grid__inner">{children}</div>
		</div>
	);
}

LayoutGrid.Cell = (props: ICellProps) => {
	return <div className="mdc-layout-grid__cell">{props.children}</div>;
};
