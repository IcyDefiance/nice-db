import * as React from "react";
import styled from "styled-components";

const StyledEditDiv = styled.div`
	height: 50vh;
`;

export interface IEditorProps {
	className?: string;
	onChange?: (sql: string) => void;
}

export function Editor({ className, onChange }: IEditorProps) {
	return (
		<StyledEditDiv
			contentEditable
			className={`form-control ${className}`}
			onInput={(event) => onChange && onChange(event.currentTarget.textContent!)}
		/>
	);
}
