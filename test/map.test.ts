import * as tImmutable from "../lib/index";
import * as t from "io-ts";
import {Map} from "immutable";
// @ts-ignore
import {expectRight, expectLeft} from "./expectEither";

describe("is", () => {

    it("is returns true if the input is a map and all keys and all values have the correct type", () => {
        const map = Map([[1, "one"], [2, "two"]]);
        const isMap = tImmutable.map(t.number, t.string).is(map);
        expect(isMap).toBeTruthy();
    });

    it("is returns false if the input is a map, but the keys have the wrong type", () => {
        const map = Map([[1, "one"], [2, "two"]]);
        const isMap = tImmutable.map(t.string, t.string).is(map);
        expect(isMap).toBeFalsy();
    });

    it("is returns false if the input is a map, but the values have the wrong type", () => {
        const map = Map([[1, "one"], [2, "two"]]);
        const isMap = tImmutable.map(t.number, t.number).is(map);
        expect(isMap).toBeFalsy();
    });

});

describe("decode", () => {

    describe("Format: object", () => {

        it("decodes an empty object", () => {
            const encoded = {};
            const decoded = tImmutable.map(t.string, t.number, "object").decode(encoded);
            const expected = Map();
            expectRight(decoded);
            expect(decoded.right).toEqual(expected);
        });

        it("decodes an object with values of the correct type", () => {
            const encoded = {
                one: 1
            };
            const decoded = tImmutable.map(t.string, t.number, "object").decode(encoded);
            const expected = Map().set("one", 1);
            expectRight(decoded);
            expect(decoded.right).toEqual(expected);
        });

        it("fails decoding an object if the values are of the wrong type", () => {
            const encoded = {
                one: "one"
            };
            const decoded = tImmutable.map(t.string, t.number, "object").decode(encoded);
            expectLeft(decoded);

        });

        it("fails decoding if the input is no object", () => {
            const encoded = [""];
            const decoded = tImmutable.map(t.string, t.number, "object").decode(encoded);
            expectLeft(decoded);
        });

    });

    describe("Format: tuples", () => {

        it("decodes an empty array", () => {
            const encoded: Array<any> = [];
            const decoded = tImmutable.map(t.number, t.string).decode(encoded);
            const expected = Map();
            expectRight(decoded);
            expect(decoded.right).toEqual(expected);
        });

        it("decodes an array with correct tuples", () => {
            const encoded: Array<any> = [[1, "one"], [2, "two"]];
            const decoded = tImmutable.map(t.number, t.string).decode(encoded);
            const expected = Map().set(1, "one").set(2, "two");
            expectRight(decoded);
            expect(decoded.right).toEqual(expected);
        });

        it("fails decoding if the keys are of the wrong type", () => {
            const encoded: Array<any> = [["1", "one"], ["2", "two"]];
            const decoded = tImmutable.map(t.number, t.string).decode(encoded);
            expectLeft(decoded);
        });

        it("fails decoding if the values are of the wrong type", () => {
            const encoded: Array<any> = [[1, "one"], [2, "two"]];
            const decoded = tImmutable.map(t.number, t.number).decode(encoded);
            expectLeft(decoded);
        });

        it("fails if the input is no array of tuples", () => {
            const encoded: Array<any> = [1, 2, 3];
            const decoded = tImmutable.map(t.number, t.string).decode(encoded);
            expectLeft(decoded);
        });

    });

    describe("Format: pairs", () => {

        it("decodes empty array", () => {
            const encoded: Array<any> = [];
            const decoded = tImmutable.map(t.number, t.string, "pairs").decode(encoded);
            const expected = Map();
            expectRight(decoded);
            expect(decoded.right).toEqual(expected);
        });

        it("decodes an array of pairs if the keys and values are of the correct type", () => {
            const encoded: Array<any> = [{key: 1, value: "one"}, {key: 2, value: "two"}];
            const decoded = tImmutable.map(t.number, t.string, "pairs").decode(encoded);
            const expected = Map().set(1, "one").set(2, "two");
            expectRight(decoded);
            expect(decoded.right).toEqual(expected);
        });

        it("fails decoding an array of pairs if the keys are of the wrong type", () => {
            const encoded: Array<any> = [{key: 1, value: "one"}, {key: 2, value: "two"}];
            const decoded = tImmutable.map(t.string, t.string, "pairs").decode(encoded);
            expectLeft(decoded);
        });

        it("fails decoding an array of pairs if the values are of the wrong type", () => {
            const encoded: Array<any> = [{key: 1, value: "one"}, {key: 2, value: "two"}];
            const decoded = tImmutable.map(t.number, t.number, "pairs").decode(encoded);
            expectLeft(decoded);
        });

        it("fails decoding if the input is not an array of pairs", () => {
            const encoded: Array<any> = [{key: 1}];
            const decoded = tImmutable.map(t.number, t.number).decode(encoded);
            expectLeft(decoded);
        });

    })

});

describe("encode", () => {

    describe("Format: object", () => {

        it("encodes map", () => {
            const decoded: Map<string, string> = Map<string, string>().set("1", "one").set("2", "two");
            const encoded = tImmutable.map(t.string, t.string, "object").encode(decoded);
            const expected = {"1": "one", "2": "two"};
            expect(encoded).toEqual(expected);
        });

    });

    describe("Format: tuples", () => {

        it("encodes map", () => {
            const decoded: Map<number, string> = Map<number, string>().set(1, "one").set(2, "two");
            const encoded = tImmutable.map(t.number, t.string).encode(decoded);
            const expected = [[1, "one"], [2, "two"]];
            expect(encoded).toEqual(expected);
        });

    });

    describe("Format: pairs", () => {

        it("encodes map", () => {
            const decoded: Map<number, string> = Map<number, string>().set(1, "one").set(2, "two");
            const encoded = tImmutable.map(t.number, t.string, "pairs").encode(decoded);
            const expected = [{key: 1, value: "one"}, {key: 2, value: "two"}];
            expect(encoded).toEqual(expected)
        });

    });

});
