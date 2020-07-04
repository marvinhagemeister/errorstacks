const CHROME_IE = /^\s*at ([a-zA-Z0-9_.\[\] ]*).*?\s?\(?(.*?):(\d+):(\d+)(?:\s<-\s(.+):(\d+):(\d+))?\)?/;
const FIREFOX = /([^@]+|^)@(.*):(\d+):(\d+)/;

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

export function parseStackTrace(stack: string): StackFrame[] {
	const isFirefox = stack.match(FIREFOX);

	return stack
		.split("\n")
		.filter((str, i) => (isFirefox || i > 0) && Boolean(str))
		.map((str) => {
			let line = -1;
			let column = -1;
			let name = "";
			let fileName = "";
			let type: FrameType = "";
			let sourceLine = 0;
			let sourceColumn = 0;
			let sourceFileName = "";

			const match = str.match(isFirefox ? FIREFOX : CHROME_IE);
			if (match) {
				if (match.length === 1) {
					type = "native";
				} else {
					type = match[0] || !isFirefox ? "" : "native";
					name = (match[1] || "").trim();
					fileName = match[2];
					line = +match[3];
					column = +match[4];

					if (match[5]) {
						sourceFileName = match[5];
					}
					if (match[6]) {
						sourceLine = +match[6];
					}
					if (match[7]) {
						sourceColumn = +match[7];
					}
				}
			}

			return {
				line,
				column,
				type,
				fileName,
				name,
				raw: str,
				sourceColumn,
				sourceFileName,
				sourceLine,
			};
		});
}
