import * as React from "react";
import { ProgressBar } from "react-bootstrap";

export interface ILoadingProps {
	label?: string;
	srOnly?: boolean;
}

export function Loading(props: ILoadingProps) {
	return <ProgressBar animated now={100} {...props} />;
}
