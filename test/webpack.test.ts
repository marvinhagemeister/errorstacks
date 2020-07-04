import { expect } from "chai";
import { parseStackTrace } from "../src";

describe("Webpack", () => {
	it("should parse source mappings from Chrome", () => {
		const trace =
			"Error: fail\n" +
			"    at foo (<anonymous>:1:33)\n" +
			"    at bar (<anonymous>:1:19 <- <anonymous>:2:3)\n" +
			"    at <anonymous>:1:13\n";

		expect(parseStackTrace(trace)).to.deep.equal([
			{
				name: "foo",
				line: 1,
				column: 33,
				type: "",
				fileName: "<anonymous>",
				raw: "    at foo (<anonymous>:1:33)",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
			{
				name: "bar",
				line: 1,
				column: 19,
				type: "",
				fileName: "<anonymous>",
				raw: "    at bar (<anonymous>:1:19 <- <anonymous>:2:3)",
				sourceColumn: 3,
				sourceFileName: "<anonymous>",
				sourceLine: 2,
			},
			{
				name: "",
				line: 1,
				column: 13,
				type: "",
				fileName: "<anonymous>",
				raw: "    at <anonymous>:1:13",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
		]);
	});
});
