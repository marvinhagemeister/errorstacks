import { expect } from "chai";
import { parseStackTrace } from "../src";

describe("Webkit", () => {
	it("should match stack trace #1", () => {
		const trace =
			"AssertionError@http://localhost:8000/node_modules/chai/chai.js:9449:22\n" +
			"http://localhost:8000/node_modules/chai/chai.js:239:31\n" +
			"assertEqual@http://localhost:8000/node_modules/chai/chai.js:1387:18\n" +
			"methodWrapper@http://localhost:8000/node_modules/chai/chai.js:7824:30\n" +
			"[native code]\n" +
			"http://localhost:8000/mytest.test.js?wtr-session-id=05c3d9b6-ea4b-467b-ac23-de275675ee27:13:46\n";

		expect(parseStackTrace(trace)).to.deep.equal([
			{
				column: 22,
				fileName: "http://localhost:8000/node_modules/chai/chai.js",
				line: 9449,
				name: "AssertionError",
				raw:
					"AssertionError@http://localhost:8000/node_modules/chai/chai.js:9449:22",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "",
			},
			{
				column: 31,
				fileName: "http://localhost:8000/node_modules/chai/chai.js",
				line: 239,
				name: "",
				raw: "http://localhost:8000/node_modules/chai/chai.js:239:31",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "",
			},
			{
				column: 18,
				fileName: "http://localhost:8000/node_modules/chai/chai.js",
				line: 1387,
				name: "assertEqual",
				raw:
					"assertEqual@http://localhost:8000/node_modules/chai/chai.js:1387:18",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "",
			},
			{
				column: 30,
				fileName: "http://localhost:8000/node_modules/chai/chai.js",
				line: 7824,
				name: "methodWrapper",
				raw:
					"methodWrapper@http://localhost:8000/node_modules/chai/chai.js:7824:30",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "",
			},
			{
				column: -1,
				fileName: "",
				line: -1,
				name: "",
				raw: "[native code]",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "native",
			},
			{
				column: 46,
				fileName:
					"http://localhost:8000/mytest.test.js?wtr-session-id=05c3d9b6-ea4b-467b-ac23-de275675ee27",
				line: 13,
				name: "",
				raw:
					"http://localhost:8000/mytest.test.js?wtr-session-id=05c3d9b6-ea4b-467b-ac23-de275675ee27:13:46",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "",
			},
		]);
	});

	it("should match stack trace of module execution", () => {
		const trace =
			"module code@http://localhost:8000/my-test.js:1:16\n" +
			"evaluate@[native code]\n" +
			"moduleEvaluation@[native code]\n" +
			"moduleEvaluation@[native code]\n" +
			"[native code]\n" +
			"promiseReactionJobWithoutPromise@[native code]\n" +
			"promiseReactionJob@[native code]";

		expect(parseStackTrace(trace)).to.deep.equal([
			{
				column: 16,
				fileName: "http://localhost:8000/my-test.js",
				line: 1,
				name: "module code",
				raw: "module code@http://localhost:8000/my-test.js:1:16",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "",
			},
			{
				column: -1,
				fileName: "",
				line: -1,
				name: "",
				raw: "evaluate@[native code]",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "native",
			},
			{
				column: -1,
				fileName: "",
				line: -1,
				name: "",
				raw: "moduleEvaluation@[native code]",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "native",
			},
			{
				column: -1,
				fileName: "",
				line: -1,
				name: "",
				raw: "moduleEvaluation@[native code]",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "native",
			},
			{
				column: -1,
				fileName: "",
				line: -1,
				name: "",
				raw: "[native code]",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "native",
			},
			{
				column: -1,
				fileName: "",
				line: -1,
				name: "",
				raw: "promiseReactionJobWithoutPromise@[native code]",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "native",
			},
			{
				column: -1,
				fileName: "",
				line: -1,
				name: "",
				raw: "promiseReactionJob@[native code]",
				sourceColumn: -1,
				sourceFileName: "",
				sourceLine: -1,
				type: "native",
			},
		]);
	});
});
