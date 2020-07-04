export interface StackFrame {
	line: number;
	column: number;
	name: string;
	fileName: string;
	type: FrameType;
	raw: string;

	// Some bundlers like webpack add the original source
	// location to the stack
	sourceLine: number;
	sourceColumn: number;
	sourceFileName: string;
}

export type FrameType = "native" | "";

function createRawFrame(raw: string): StackFrame {
	return {
		column: -1,
		fileName: "",
		line: -1,
		name: "",
		raw,
		sourceColumn: -1,
		sourceFileName: "",
		sourceLine: -1,
		type: "",
	};
}

const FIREFOX = /([^@]+|^)@(.*):(\d+):(\d+)/;

export function parseFirefox(stack: string): StackFrame[] {
	return stack
		.split("\n")
		.filter(Boolean)
		.map((str) => {
			const match = str.match(FIREFOX);
			if (!match) {
				return createRawFrame(str);
			}

			const line = match[3] ? +match[3] : -1;
			const column = match[4] ? +match[4] : -1;
			const fileName = match[2] ? match[2] : "";

			return {
				line,
				column,
				type: match[0] ? "" : "native",
				fileName,
				name: (match[1] || "").trim(),
				raw: str,
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			};
		});
}

const CHROME_IE = /^\s*at\s([a-zA-Z0-9_.\[\] <>]*).*?\s?\((.*?):(\d+):(\d+)(?:\s<-\s(.+):(\d+):(\d+))?\)/;
const CHROME_IE_SHORT = /^\s*at\s(.*):(\d+):(\d+)/;
const CHROME_IE_NATIVE = /\s*at\s<(.*)>\s*/;
const CHROME_IE_DETECTOR = /\s*at\s.+/;

export function parseChromeIe(stack: string): StackFrame[] {
	const lines = stack.split("\n");

	// Many frameworks mess with error.stack. So we use this check
	// to find the first line of the actual stack
	const start = lines.findIndex((line) => CHROME_IE_DETECTOR.test(line));
	if (start === -1) {
		return [];
	}

	const frames: StackFrame[] = [];
	for (let i = start; i < lines.length; i++) {
		const str = lines[i];

		// Sometimes frameworks will put an empty line inbetween
		if (!str) continue;

		const frame = createRawFrame(str);

		const match = str.match(CHROME_IE);
		if (match) {
			frame.name = (match[1] || "").trim();
			frame.line = match[3] ? +match[3] : -1;
			frame.column = match[4] ? +match[4] : -1;
			frame.fileName = match[2] ? match[2] : "";

			frame.sourceLine = match[6] ? +match[6] : -1;
			frame.sourceColumn = match[7] ? +match[7] : -1;
			frame.sourceFileName = match[5] ? match[5] : "";

			frames.push(frame);
			continue;
		}

		// Short form
		const short = str.match(CHROME_IE_SHORT);
		if (short) {
			if (short[1]) frame.fileName = short[1];
			if (short[2]) frame.line = +short[2];
			if (short[3]) frame.column = +short[3];
			frames.push(frame);
			continue;
		}

		const native = str.match(CHROME_IE_NATIVE);
		if (native) {
			frame.name = native[1];
			frame.type = "native";
			frames.push(frame);
			continue;
		}

		frames.push(frame);
	}

	return frames;
}

export function parseStackTrace(stack: string): StackFrame[] {
	if (FIREFOX.test(stack)) {
		return parseFirefox(stack);
	}

	return parseChromeIe(stack);
}
