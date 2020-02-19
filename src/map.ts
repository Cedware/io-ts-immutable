import * as t from "io-ts";
import {Map} from "immutable";
import {Context} from "io-ts";
import {Either, isLeft} from "fp-ts/lib/Either";

type MapFormat = "object" | "tuples" | "pairs"

interface KeyValuePair<K, V> {
    key: K,
    value: V
}

function KeyValuePair<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue) {
    return t.type({
        key: keyCodec,
        value: valueCodec
    }, "KeyValuePair")
}


// <editor-fold desc="validate">
function validateTuples<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue, u: unknown,
                                                                      context: Context): Either<t.Errors, Map<t.TypeOf<CKey>, t.TypeOf<CValue>>> {
    const validatedArray = t.array(t.tuple([keyCodec, valueCodec])).validate(u, context);
    if(isLeft(validatedArray)) {
        return t.failure(u, context);
    }
    const decoded =  Map<t.TypeOf<CKey>, t.TypeOf<CValue>>(validatedArray.right);
    return t.success(decoded);
}

function validatePairs<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue, u: unknown,
                                                                     context: Context): Either<t.Errors, Map<t.TypeOf<CKey>, t.TypeOf<CValue>>> {
    const validatedArray = t.array(KeyValuePair(keyCodec, valueCodec)).validate(u, context);
    if(isLeft(validatedArray)) {
        return t.failure(u, context);
    }
    const tupleArray = validatedArray.right.map(pair => [pair.key, pair.value] as [t.TypeOf<CKey>, t.TypeOf<CValue>]);
    const decoded = Map<t.TypeOf<CKey>, t.TypeOf<CValue>>(tupleArray);
    return t.success(decoded);
}


function validateObject<CValue extends t.Mixed>(keyCodec: t.StringC, valueCodec: CValue, u: unknown,
                                                context: Context): Either<t.Errors, Map<string, t.TypeOf<CValue>>> {
    const decodedRecord = t.record(keyCodec, valueCodec).decode(u);
    let map = Map<string, t.TypeOf<CValue>>().asMutable();
    if(isLeft(decodedRecord)) {
        return t.failure(u, context);
    }
    for(const key of Object.keys(decodedRecord.right)) {
        map.set(key, decodedRecord.right[key]);
    }
    return t.success(map.asImmutable());
}
// </editor-fold>

// <editor-fold desc="encode">
function encodeAsTuples<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue,
                                                                    input: Map<t.TypeOf<CKey>, t.TypeOf<CValue>>): Array<[t.OutputOf<CKey>, t.OutputOf<CValue>]>{
    return input.mapEntries(e => [keyCodec.encode(e[0]), valueCodec.encode(e[1])] as [t.OutputOf<CKey>, t.OutputOf<CValue>]).toArray()
}

function encodeAsPairs<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue,
                                                                    input: Map<t.TypeOf<CKey>, t.TypeOf<CValue>>): Array<KeyValuePair<t.OutputOf<CKey>, t.OutputOf<CValue>>>{
    return input.toArray().map(e => ({
        key: keyCodec.encode(e[0]),
        value: valueCodec.encode(e[1])
    }));
}

function encodeAsObject<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue,
                                                                     input: Map<t.TypeOf<CKey>, t.TypeOf<CValue>>): Object{
    return input.mapEntries(e => [keyCodec.encode(e[0]), valueCodec.encode(e[1])] as [t.OutputOf<CKey>, t.OutputOf<CValue>]).toObject();
}


// </editor-fold>

/**
 * A codec for the Map type of immutablejs.
 * @param keyCodec The codec for the key.
 * @param valueCodec The codec for the value.
 * @param format Configures the format of the encoded values.
 * Object: {
 *  key1: "value"
 * }
 * TupleArray: [
 *  ["key1", "value1"],
 *  ["key1", "value1"]
 * ]
 * KeyValueArray: [
 *  {key: "key1", value: "value1"},
 *  {key: "key2", value: "value2"},
 * ]
 */
export function map<CValue extends t.Mixed>(keyCodec: t.StringC, valueCodec: CValue, format: "object"): t.Type<Map<string, t.TypeOf<CValue>>, object>;
export function map<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue, format: "tuples"): t.Type<Map<string, CValue>, Array<[t.OutputOf<CKey>, t.OutputOf<CValue>]>>
export function map<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue): t.Type<Map<t.TypeOf<CKey>, t.TypeOf<CValue>>, Array<[t.OutputOf<CKey>, t.OutputOf<CValue>]>>
export function map<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue, format: "pairs"): t.Type<Map<t.TypeOf<CKey>, t.TypeOf<CValue>>, Array<KeyValuePair<t.OutputOf<CKey>, t.OutputOf<CValue>>>>
export function map<CKey extends t.Mixed, CValue extends t.Mixed>(keyCodec: CKey, valueCodec: CValue, format: MapFormat = "tuples") {

    type Key = t.TypeOf<CKey>;
    type Value = t.TypeOf<CValue>;

    return new t.Type<Map<Key, Value>, any, unknown>(
        `Map<${keyCodec.name}, ${valueCodec.name}>`,
        (u: unknown): u is Map<Key, Value> => {
            if(!Map.isMap(u)) {
                return false;
            }
            const allKeysAreCorrect = u.keySeq().every(keyCodec.is);
            const allValuesAreCorrect = u.valueSeq().every(valueCodec.is);
            return allKeysAreCorrect && allValuesAreCorrect;
        },
        (u: unknown, c: Context) => {
            switch (format) {
                case "tuples":
                    return validateTuples(keyCodec, valueCodec, u, c);
                case "pairs":
                    return validatePairs(keyCodec, valueCodec, u, c);
                case "object":
                    return validateObject(keyCodec as any as t.StringC, valueCodec, u, c);
            }
        },
        (i) => {
            switch (format) {
                case "tuples":
                    return encodeAsTuples(keyCodec, valueCodec, i);
                case "pairs":
                    return encodeAsPairs(keyCodec, valueCodec, i);
                default:
                    return encodeAsObject(keyCodec, valueCodec, i);
            }
        }
    );

}
