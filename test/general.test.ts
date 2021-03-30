import { expect } from "chai";
import { parseStackTrace } from "../src";

describe("general", () => {
	it("should not throw when stack trace is missing", () => {
		expect(() => parseStackTrace(undefined)).not.to.throw();
	});
});
