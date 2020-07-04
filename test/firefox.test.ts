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
				fileName: "debugger eval code",
				raw: "foo@debugger eval code:1:27",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
			{
				name: "bar",
				line: 1,
				column: 13,
				type: "",
				fileName: "debugger eval code",
				raw: "bar@debugger eval code:1:13",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
			{
				name: "",
				line: 1,
				column: 13,
				type: "",
				fileName: "debugger eval code",
				raw: "@debugger eval code:1:13",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
		]);
	});

	it("should should match stack trace #2", () => {
		const trace = "@http://localhost:3000/App.jsx?t=1589606689786:33:7";

		expect(parseStackTrace(trace)).to.deep.equal([
			{
				column: 7,
				fileName: "http://localhost:3000/App.jsx?t=1589606689786",
				line: 33,
				name: "",
				raw: "@http://localhost:3000/App.jsx?t=1589606689786:33:7",
				type: "",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
		]);
	});

	it("should should match stack trace #3", () => {
		const trace =
			"App@http://localhost:3000/App.jsx?t=1589606715125:31:9\n" +
			"E@http://localhost:3000/@modules/preact/dist/preact.mjs?import:1:7584\n" +
			"b/l.__k<@http://localhost:3000/@modules/preact/dist/preact.mjs?import:1:1908\n" +
			"@http://localhost:3000/main.js:52:7\n";

		expect(parseStackTrace(trace)).to.deep.equal([
			{
				column: 9,
				fileName: "http://localhost:3000/App.jsx?t=1589606715125",
				line: 31,
				name: "App",
				raw: "App@http://localhost:3000/App.jsx?t=1589606715125:31:9",
				type: "",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
			{
				column: 7584,
				fileName:
					"http://localhost:3000/@modules/preact/dist/preact.mjs?import",
				line: 1,
				name: "E",
				raw:
					"E@http://localhost:3000/@modules/preact/dist/preact.mjs?import:1:7584",
				type: "",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
			{
				column: 1908,
				fileName:
					"http://localhost:3000/@modules/preact/dist/preact.mjs?import",
				line: 1,
				name: "b/l.__k<",
				raw:
					"b/l.__k<@http://localhost:3000/@modules/preact/dist/preact.mjs?import:1:1908",
				type: "",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
			{
				column: 7,
				fileName: "http://localhost:3000/main.js",
				line: 52,
				name: "",
				raw: "@http://localhost:3000/main.js:52:7",
				type: "",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
			},
		]);
	});
});
