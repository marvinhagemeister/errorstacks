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

const FIREFOX_WEBKIT = /([^@]+|^)@(.*):(\d+):(\d+)/;
const WEBKIT_ADDRESS_UNNAMED = /^(http(s)?:\/\/.*):(\d+):(\d+)$/;
const WEBKIT_NATIVE_UNNAMED = "[native code]";

function parsWebkit(str: string): StackFrame {
	if (str.includes(WEBKIT_NATIVE_UNNAMED)) {
		return {
			line: -1,
			column: -1,
			type: "native",
			fileName: "",
			name: "",
			raw: str,
			sourceColumn: -1,
			sourceFileName: "",
			sourceLine: -1,
		};
	}

	const match = str.match(WEBKIT_ADDRESS_UNNAMED);
	if (match) {
		const line = match[3] ? +match[3] : -1;
		const column = match[4] ? +match[4] : -1;
		const fileName = match[1] ? match[1] : "";
		return {
			line,
			column,
			type: "",
			fileName,
			name: "",
			raw: str,
			sourceColumn: -1,
			sourceFileName: "",
			sourceLine: -1,
		};
	}

	return createRawFrame(str);
}

function parseFirefoxWebkit(lines: string[]): StackFrame[] {
	return lines.map(str => {
		const match = str.match(FIREFOX_WEBKIT);
		if (!match) {
			return parsWebkit(str);
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

// foo.bar.js:123:39
// foo.bar.js:123:39 <- original.js:123:34
const CHROME_MAPPED = /(.*?):(\d+):(\d+)(\s<-\s(.+):(\d+):(\d+))?/;
function parseMapped(frame: StackFrame, maybeMapped: string) {
	const match = maybeMapped.match(CHROME_MAPPED);
	if (match) {
		frame.fileName = match[1];
		frame.line = +match[2];
		frame.column = +match[3];

		if (match[5]) frame.sourceFileName = match[5];
		if (match[6]) frame.sourceLine = +match[6];
		if (match[7]) frame.sourceColumn = +match[7];
	}
}

// at <SomeFramework>
const CHROME_IE_NATIVE_NO_LINE = /^at\s(<.*>)$/;
// at <SomeFramework>:123:39
const CHROME_IE_NATIVE = /^\s*at\s(<.*>):(\d+):(\d+)$/;
// at foo.bar(bob) (foo.bar.js:123:39)
// at foo.bar(bob) (foo.bar.js:123:39 <- original.js:123:34)
const CHROME_IE_FUNCTION = /^at\s(.*)\s\((.*)\)$/;
// >= Chrome 88
// spy() at Component.Foo [as constructor] (original.js:123:34)
// spy() at Component.Foo [as constructor] (foo.bar.js:123:39 <- original.js:123:34)
const CHROME_IE_FUNCTION_WITH_CALL = /^([\w\W]*)\s\((.*)\)/;
const CHROME_IE_DETECTOR = /\s*at\s.+/;
// at about:blank:1:7
const CHROME_BLANK = /\s*at\s(.*):(\d+):(\d+)$/;

function parseChromeIe(lines: string[]): StackFrame[] {
	// Many frameworks mess with error.stack. So we use this check
	// to find the first line of the actual stack
	const start = lines.findIndex(line => CHROME_IE_DETECTOR.test(line));
	if (start === -1) {
		return [];
	}

	const frames: StackFrame[] = [];
	for (let i = start; i < lines.length; i++) {
		const str = lines[i].replace(/^\s+|\s+$/g, "");

		const frame = createRawFrame(lines[i]);

		const nativeNoLine = str.match(CHROME_IE_NATIVE_NO_LINE);
		if (nativeNoLine) {
			frame.fileName = nativeNoLine[1];
			frame.type = "native";
			frames.push(frame);
			continue;
		}

		const native = str.match(CHROME_IE_NATIVE);
		if (native) {
			frame.fileName = native[1];
			frame.type = "native";
			if (native[2]) frame.line = +native[2];
			if (native[3]) frame.column = +native[3];

			frames.push(frame);
			continue;
		}

		const withFn = str.match(CHROME_IE_FUNCTION);
		if (withFn) {
			frame.name = withFn[1];
			parseMapped(frame, withFn[2]);
			frames.push(frame);
			continue;
		}

		const blank = str.match(CHROME_BLANK);
		if (blank) {
			frame.fileName = blank[1];
			frame.line = +blank[2];
			frame.column = +blank[3];
			frames.push(frame);
			continue;
		}

		const withFnCall = str.match(CHROME_IE_FUNCTION_WITH_CALL);
		if (withFnCall) {
			frame.name = withFnCall[1];
			parseMapped(frame, withFnCall[2]);
			frames.push(frame);
			continue;
		}

		frames.push(frame);
	}

	return frames;
}

export function parseStackTrace(stack: string): StackFrame[] {
	const lines = stack.split("\n").filter(Boolean);

	// Libraries like node's "assert" module mess with the stack trace by
	// prepending custom data. So we need to do a precheck, to determine
	// which browser the trace is coming from.
	if (lines.some(line => CHROME_IE_DETECTOR.test(line))) {
		return parseChromeIe(lines);
	}
	return parseFirefoxWebkit(lines);
}
