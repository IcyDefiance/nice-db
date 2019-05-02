import * as React from "react";
import styled from "styled-components";

const StyledEditDiv = styled.div`
	height: 50vh;
`;

export function Editor() {
	return <StyledEditDiv contentEditable className="form-control" />;
}
