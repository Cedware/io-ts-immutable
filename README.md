# Installation

```
npm install io-ts-immutable
```

or

```
yarn add io-ts-immutable
```

# Usage

## List

```typescript
import {List} from "immutable";
import * as tImmutable from "io-ts-immutable";
import * as t from "io-ts";
const input = [1, 2, 3];
const decoded: List<number> = tImmutable.list(t.number).decode(input);
const encoded = tImmutable.list(t.number).encode(decoded);
```

## Map
The map-codec has, besides it's two codec parameters, a third parameter called "format".
This parameter controls how the encoded value must look like.

```typescript
import * as tImmutable from "io-ts-immutable";
import * as t from "io-ts";
const input = {
    one: 1,
    two: 2,
    three: 3
};
const decoded = tImmutable.map(t.string, t.number, "object").decode(input);
const encoded = tImmutable.map(t.string, t.number, "object").encode(decoded);
```

```typescript
import * as tImmutable from "io-ts-immutable";
import * as t from "io-ts";
const input: Array<[string, number]> = [["one", 1], ["two", 2], ["three", 3]];
const decoded = tImmutable.map(t.string, t.number, "tuples").decode(input);
const encoded = tImmutable.map(t.string, t.number, "tuples").encode(decoded);
```

```typescript
import * as tImmutable from "io-ts-immutable";
import * as t from "io-ts";
const input = [
    {key: "one", value: 1},
    {key: "two", value: 2},
    {key: "three", value: 3}
];
const decoded = tImmutable.map(t.string, t.number, "pairs").decode(input);
const encoded = tImmutable.map(t.string, t.number, "pairs").encode(decoded);
```
