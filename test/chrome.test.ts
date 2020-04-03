import { expect } from "chai";
import { parseStackTrace } from "../src";

describe("Chrome", () => {
	it("should match debugger stack trace", () => {
		const trace =
			"Error: fail\n" +
			"    at foo (<anonymous>:1:33)\n" +
			"    at bar (<anonymous>:1:19)\n" +
			"    at <anonymous>:1:13\n";

		expect(parseStackTrace(trace)).to.deep.equal([
			{
				name: "foo",
				line: 1,
				column: 33,
				type: "",
				raw: "    at foo (<anonymous>:1:33)",
			},
			{
				name: "bar",
				line: 1,
				column: 19,
				type: "",
				raw: "    at bar (<anonymous>:1:19)",
			},
			{
				name: "",
				line: 1,
				column: 13,
				type: "",
				raw: "    at <anonymous>:1:13",
			},
		]);
	});
});
