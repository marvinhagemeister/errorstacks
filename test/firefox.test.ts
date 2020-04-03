import { expect } from "chai";
import { parseStackTrace } from "../src";

describe("Firefox", () => {
	it("should match debugger stack trace", () => {
		const trace =
			"foo@debugger eval code:1:27\n" +
			"bar@debugger eval code:1:13\n" +
			"@debugger eval code:1:13";

		expect(parseStackTrace(trace)).to.deep.equal([
			{
				name: "foo",
				line: 1,
				column: 27,
				type: "",
			},
			{
				name: "bar",
				line: 1,
				column: 13,
				type: "",
			},
			{
				name: "",
				line: 1,
				column: 13,
				type: "",
			},
		]);
	});
});
