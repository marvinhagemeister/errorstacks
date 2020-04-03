const CHROME_IE = /^\s*at ([a-zA-Z0-9_]*).*\(?\S+:(\d+):(\d+)\)?/;
const FIREFOX = /(\S+|^)@.*:(\d+):(\d+)/;

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
			let type: FrameType = "";

			if (isFirefox) {
				const match = str.match(FIREFOX);
				if (match) {
					type = match[0] ? "" : "native";
					name = match[1];
					line = +match[2];
					column = +match[3];
				}
			} else {
				const match = str.match(CHROME_IE);
				if (match) {
					if (match.length === 1) {
						type = "native";
					} else {
						name = match[1];
						line = +match[2];
						column = +match[3];
					}
				}
			}

			return {
				line,
				column,
				type,
				name,
				raw: str,
			};
		});
}
