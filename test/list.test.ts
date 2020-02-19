import * as tImmutable from "../lib/index";
import * as t from "io-ts";
import {List} from "immutable";
import {isRight} from "fp-ts/lib/Either";

describe("is", () => {

    it("is returns true if u is a list with all items matching the given coded", () => {
        const isList = tImmutable.list(t.string).is(List.of("a", "b", "c"));
        expect(isList).toBeTruthy();
    });

    it("is returns false if u is a list and only some items match the given codec", () => {
        const isList = tImmutable.list(t.string).is(List.of<any>("a", 1, "b"));
        expect(isList).toBeFalsy();
    });

    it("is returns false if u is a list and none of the items match the given codec", () =>{
        const isList = tImmutable.list(t.string).is(List.of(1,2,3));
        expect(isList).toBeFalsy();
    });

    it("is returns false if u is not a list", () => {
        const isList = tImmutable.list(t.string).is(["a", "b", "c"]);
        expect(isList).toBeFalsy();
    });
});

describe("decode", () => {

    it("decodes an empty array", () => {
        const input: Array<string> = [];
        const output = tImmutable.list(t.string).decode(input);
        expect(isRight(output)).toBeTruthy();
        // @ts-ignore
        expect(output.right).toEqual(List.of())

    });

    it("decodes a non empty array", () => {
        const input = ["a", "b", "c"];
        const output = tImmutable.list(t.string).decode(input);
        expect(isRight(output)).toBeTruthy();
        // @ts-ignore
        expect(output.right).toEqual(List.of("a", "b", "c"));
    });

    it("fails decoding an array with the wrong content", () => {
        const input = ["a", "b", "c"];
        const output = tImmutable.list(t.number).decode(input);
        expect(isRight(output)).toBeFalsy();
    });

    it("fails decoding a object that is not an array", () => {
        const input = "abc";
        const output = tImmutable.list(t.string).decode(input);
        expect(isRight(output)).toBeFalsy();
    });

});

describe("encode", () => {

    it("encodes an empty list", ()=> {
        const input = List();
        const output = tImmutable.list(t.string).encode(input);
        expect(output).toEqual([]);
    });

    it("encodes a non empty list", () => {
        const input = List.of("1", "2", "3");
        const output = tImmutable.list(t.string).encode(input);
        expect(output).toEqual(["1", "2", "3"]);
    });

});
