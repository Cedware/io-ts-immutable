import * as t from "io-ts";
import {Set} from "immutable";
import {isLeft} from "fp-ts/lib/Either";

/**
 * A codec for the Set type from immutable.
 * This codec decodes a javascript array into an immutable set, and it encodes the immutable set to a javascript array
 * @param codec The codec for the set items.
 * @since 0.2.0
 */
export function set<C extends t.Mixed>(codec: C) {
    type Item = t.TypeOf<C>;
    type ItemOutput = t.OutputOf<C>;

  return new t.Type<Set<Item>, Array<ItemOutput>, unknown>(
    `Set<${codec.name}>`,
    (u: unknown): u is Set<Item> => Set.isSet(u) && u.every(uItem => codec.is(uItem)),
    (u: unknown, context) => {
        const decodedArray = t.array(codec).validate(u, context);
        if(isLeft(decodedArray)) {
            return t.failure(u, context, "Could not decode input to an array");
        }
        return t.success(Set(decodedArray.right));
    },
    (s) => s.map(codec.encode).toArray()
  );
}
