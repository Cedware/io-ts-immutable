import * as t from "io-ts";
import {List} from "immutable";
import {isLeft} from "fp-ts/lib/Either";

/**
 * A codec for the List type from immutable.
 * This codec decodes a javascript array into an immutable list, and it encodes the immutable list to a javascript array
 * @param codec The codec for the list items.
 * @since 0.1.0
 */
export function list<C extends t.Mixed>(codec: C) {
    type Item = t.TypeOf<C>;
    type ItemOutput = t.OutputOf<C>;

    return new t.Type<List<Item>, Array<ItemOutput>, unknown>(
        `List<${codec.name}>`,
        (u: unknown): u is List<Item> => List.isList(u) && u.every(uItem => codec.is(uItem)),
        (u: unknown, context) => {
            const decodedArray = t.array(codec).validate(u, context);
            if(isLeft(decodedArray)) {
                return t.failure(u, context, "Could not decode the input to an array");
            }
            return t.success(List(decodedArray.right));
        },
        (l) => l.map(codec.encode).toArray()
    );
}
