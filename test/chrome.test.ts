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
				fileName: "<anonymous>",
				raw: "    at foo (<anonymous>:1:33)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "bar",
				line: 1,
				column: 19,
				type: "",
				fileName: "<anonymous>",
				raw: "    at bar (<anonymous>:1:19)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "",
				line: 1,
				column: 13,
				type: "",
				fileName: "<anonymous>",
				raw: "    at <anonymous>:1:13",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
		]);
	});

	it("should match debugger stack trace #2", () => {
		const trace =
			"Error\n" +
			"    at addHookStack (installHook.js:845:18)\n" +
			"    at Object.o._hook.o.__h (installHook.js:1502:14)\n" +
			"    at p (preactHooks.js:18:30)\n" +
			"    at n.useEffect (preactHooks.js:139:12)\n" +
			"    at useBar (test-case.js:51:2)\n" +
			"    at useFoo (test-case.js:56:9)\n" +
			"    at m.CustomHooks [as constructor] (test-case.js:60:14)\n" +
			"    at inspectHooks (installHook.js:941:16)\n" +
			"    at inspectVNode (installHook.js:975:31)\n" +
			"    at Object.inspect (installHook.js:1290:25)";

		expect(parseStackTrace(trace)).to.deep.equal([
			{
				name: "addHookStack",
				line: 845,
				column: 18,
				type: "",
				fileName: "installHook.js",
				raw: "    at addHookStack (installHook.js:845:18)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "Object.o._hook.o.__h",
				line: 1502,
				column: 14,
				type: "",
				fileName: "installHook.js",
				raw: "    at Object.o._hook.o.__h (installHook.js:1502:14)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "p",
				line: 18,
				column: 30,
				type: "",
				fileName: "preactHooks.js",
				raw: "    at p (preactHooks.js:18:30)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "n.useEffect",
				line: 139,
				column: 12,
				type: "",
				fileName: "preactHooks.js",
				raw: "    at n.useEffect (preactHooks.js:139:12)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "useBar",
				line: 51,
				column: 2,
				type: "",
				fileName: "test-case.js",
				raw: "    at useBar (test-case.js:51:2)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "useFoo",
				line: 56,
				column: 9,
				type: "",
				fileName: "test-case.js",
				raw: "    at useFoo (test-case.js:56:9)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "m.CustomHooks [as constructor]",
				line: 60,
				column: 14,
				type: "",
				fileName: "test-case.js",
				raw: "    at m.CustomHooks [as constructor] (test-case.js:60:14)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "inspectHooks",
				line: 941,
				column: 16,
				type: "",
				fileName: "installHook.js",
				raw: "    at inspectHooks (installHook.js:941:16)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "inspectVNode",
				line: 975,
				column: 31,
				type: "",
				fileName: "installHook.js",
				raw: "    at inspectVNode (installHook.js:975:31)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
			{
				name: "Object.inspect",
				line: 1290,
				column: 25,
				type: "",
				fileName: "installHook.js",
				raw: "    at Object.inspect (installHook.js:1290:25)",
				sourceColumn: 0,
				sourceFileName: "",
				sourceLine: 0,
			},
		]);
	});
});
