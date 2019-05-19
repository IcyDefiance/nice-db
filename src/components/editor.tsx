import * as React from "react";
import styled from "styled-components";
import { tokenize } from "../sql-ast/tokenizer";
import LineRipple from "@material/react-line-ripple";
import TextField from "@material/react-text-field";

const StyledEditDiv = styled.div`
	width: 100%;
	height: 50vh;
	white-space: pre-wrap;

	.token {
		&.keyword {
			color: #569cd6;
		}
	}
`;

export interface IEditorProps {
	className?: string;
	onChange?: (sql: string) => void;
}

export function Editor({ className, onChange }: IEditorProps) {
	const editor = React.useRef<HTMLDivElement>(null);
	const [active, setActive] = React.useState(false);

	function onInput(event: React.FormEvent<HTMLDivElement>) {
		const selection = window.getSelection()!;

		// TODO: support multiple cursors
		const rangeBefore = selection.getRangeAt(0);
		rangeBefore.setStart(editor.current!, 0);
		const selpos = rangeBefore.toString().length - 1;
		const marker = document.createElement("span");

		const sql = event.currentTarget.textContent!;
		const nodes = [];
		for (const token of tokenize(sql).val) {
			const tokenStart = token.text.start;
			const tokenEnd = token.text.end || sql.length;

			const span = document.createElement("span");
			span.className = `token ${token.type}`;
			if (selpos >= tokenStart && selpos < tokenEnd) {
				span.append(sql.slice(tokenStart, selpos + 1), marker, sql.slice(selpos + 1, tokenEnd));
			} else {
				span.textContent = token.text.toString();
			}
			nodes.push(span);
		}
		editor.current!.innerHTML = "";
		editor.current!.append(...nodes);

		selection!.removeAllRanges();
		const rangeAfter = new Range();
		rangeAfter.setStart(marker, 0);
		selection.addRange(rangeAfter);

		onChange && onChange(sql);
	}

	return (
		<StyledEditDiv className={`mdc-text-field mdc-text-field--no-label ${className}`}>
			<div
				ref={editor}
				contentEditable
				className="mdc-text-field__input"
				onInput={onInput}
				onFocus={() => setActive(true)}
				onBlur={() => setActive(false)}
			/>
			<LineRipple active={active} />
		</StyledEditDiv>
	);
}
