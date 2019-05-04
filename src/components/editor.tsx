import * as React from "react";
import styled from "styled-components";
import { tokenize } from "../sql-ast/tokenizer";

const StyledEditDiv = styled.div`
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

	function handleInput(event: React.FormEvent<HTMLDivElement>) {
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

	return <StyledEditDiv ref={editor} contentEditable className={`form-control ${className}`} onInput={handleInput} />;
}

function saveSelection() {
	const sel = window.getSelection()!;
	const ranges = [];
	for (let i = 0; i < sel.rangeCount; ++i) {
		ranges.push(sel.getRangeAt(i));
	}
	const backward = ranges.length == 1 && isSelectionBackward(sel);
	const rangeInfos = saveRanges(ranges, backward);

	// Ensure current selection is unaffected
	sel.removeAllRanges();
	if (backward) {
		selectRangeBackwards(sel, ranges[0]);
	} else {
		ranges.forEach(function(range) {
			sel.addRange(range);
		});
	}

	return {
		rangeInfos: rangeInfos,
		restored: false,
	};
}

function isSelectionBackward(sel: Selection) {
	if (!sel.isCollapsed) {
		const range = document.createRange();
		range.setStart(sel.anchorNode!, sel.anchorOffset);
		range.setEnd(sel.focusNode!, sel.focusOffset);
		return range.collapsed;
	}

	return false;
}

function saveRanges(ranges: Range[], backward: boolean) {
	// Order the ranges by position within the DOM, latest first, cloning the array to leave the original untouched
	ranges = [...ranges];
	ranges.sort(compareRanges);

	const rangeInfos = ranges.map(function(range) {
		return saveRange(range, backward);
	});

	// Now that all the markers are in place and DOM manipulation is over, adjust each range's boundaries to lie
	// between its markers
	for (let i = ranges.length - 1, range; i >= 0; --i) {
		range = ranges[i];
		if (range.collapsed) {
			range.setStartAfter(document.getElementById(rangeInfos[i].markerId!)!);
			range.collapse(true);
		} else {
			range.setEndBefore(document.getElementById(rangeInfos[i].endMarkerId!)!);
			range.setStartAfter(document.getElementById(rangeInfos[i].startMarkerId!)!);
		}
	}

	return rangeInfos;
}

function saveRange(range: Range, backward: boolean) {
	let startEl;
	let endEl;
	const doc = range.startContainer.ownerDocument;
	const text = range.toString();

	if (range.collapsed) {
		endEl = insertRangeBoundaryMarker(range, false);
		return {
			document: doc,
			markerId: endEl.id,
			collapsed: true,
		};
	} else {
		endEl = insertRangeBoundaryMarker(range, false);
		startEl = insertRangeBoundaryMarker(range, true);

		return {
			document: doc,
			startMarkerId: startEl.id,
			endMarkerId: endEl.id,
			collapsed: false,
			backward: backward,
			toString: function() {
				return "original text: '" + text + "', new text: '" + range.toString() + "'";
			},
		};
	}
}

const markerTextChar = "\ufeff";
function insertRangeBoundaryMarker(range: Range, atStart: boolean) {
	const markerId = "selectionBoundary_" + +new Date() + "_" + ("" + Math.random()).slice(2);
	let markerEl;

	// Clone the Range and collapse to the appropriate boundary point
	const boundaryRange = range.cloneRange();
	boundaryRange.collapse(atStart);

	// Create the marker element containing a single invisible character using DOM methods and insert it
	markerEl = document.createElement("span");
	markerEl.id = markerId;
	markerEl.style.lineHeight = "0";
	markerEl.style.display = "none";
	markerEl.textContent = markerTextChar;

	boundaryRange.insertNode(markerEl);
	return markerEl;
}

function compareRanges(r1: Range, r2: Range) {
	return r2.compareBoundaryPoints(r1.START_TO_START, r1);
}

function selectRangeBackwards(sel: Selection, range: Range) {
	const endRange = range.cloneRange();
	endRange.collapse(false);
	sel.removeAllRanges();
	sel.addRange(endRange);
	sel.extend(range.startContainer, range.startOffset);
}
