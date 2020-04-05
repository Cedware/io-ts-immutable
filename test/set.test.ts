import * as tImmutable from "../lib/index";
import * as t from "io-ts";
import {Set} from "immutable";
import {isRight} from "fp-ts/lib/Either";

describe("is", () => {

    it("is returns true if u is a set with all items matching the given codec", () => {
        const isSet = tImmutable.set(t.string).is(Set.of("a", "b", "c"));
        expect(isSet).toBeTruthy();
    });

    it("is returns false if u is a set and only some items match the given codec", () => {
        const isSet = tImmutable.set(t.string).is(Set.of<any>("a", 1, "b"));
        expect(isSet).toBeFalsy();
    });

    it("is returns false if u is a set and none of the items match the given codec", () =>{
        const isSet = tImmutable.set(t.string).is(Set.of(1,2,3));
        expect(isSet).toBeFalsy();
    });

    it("is returns false if u is not a set", () => {
        const isSet = tImmutable.set(t.string).is(["a", "b", "c"]);
        expect(isSet).toBeFalsy();
    });
});

describe("decode", () => {

    it("decodes an empty array", () => {
        const input: Array<string> = [];
        const output = tImmutable.set(t.string).decode(input);
        expect(isRight(output)).toBeTruthy();
        // @ts-ignore
        expect(output.right).toEqual(Set.of())

    });

    it("decodes a non empty array", () => {
        const input = ["a", "b", "c"];
        const output = tImmutable.set(t.string).decode(input);
        expect(isRight(output)).toBeTruthy();
        // @ts-ignore
        expect(output.right).toEqual(Set.of("a", "b", "c"));
    });

    it("fails decoding an array with the wrong content", () => {
        const input = ["a", "b", "c"];
        const output = tImmutable.set(t.number).decode(input);
        expect(isRight(output)).toBeFalsy();
    });

    it("fails decoding a object that is not an array", () => {
        const input = "abc";
        const output = tImmutable.set(t.string).decode(input);
        expect(isRight(output)).toBeFalsy();
    });

});

describe("encode", () => {

    it("encodes an empty set", ()=> {
        const input = Set();
        const output = tImmutable.set(t.string).encode(input);
        expect(output).toEqual([]);
    });

    it("encodes a non empty set", () => {
        const input = Set.of("1", "2", "3");
        const output = tImmutable.set(t.string).encode(input);
        expect(output).toEqual(["1", "2", "3"]);
    });

});
