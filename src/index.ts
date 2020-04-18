const CHROME_IE = /^\s*at ([a-zA-Z0-9_]*).*?\s?\(?(.*):(\d+):(\d+)\)?/;
const FIREFOX = /(\S+|^)@(.*):(\d+):(\d+)/;

export interface StackFrame {
	line: number;
	column: number;
	name: string;
	type: FrameType;
	raw: string;
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

			const match = str.match(isFirefox ? FIREFOX : CHROME_IE);
			if (match) {
				if (match.length === 1) {
					type = "native";
				} else {
					type = match[0] || !isFirefox ? "" : "native";
					name = match[1];
					fileName = match[2];
					line = +match[3];
					column = +match[4];
				}
			}

			return {
				line,
				column,
				type,
				fileName,
				name,
				raw: str,
			};
		});
}
