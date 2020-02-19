import {Either, isLeft, isRight, Left, Right} from "fp-ts/lib/Either";

export function expectRight<E, A>(maybeRight: Either<E, A>): asserts maybeRight is Right<A> {
    expect(isRight(maybeRight)).toBeTruthy();
}

export function expectLeft<E, A>(maybeRight: Either<E, A>): asserts maybeRight is Left<E> {
    expect(isLeft(maybeRight)).toBeTruthy();
}

