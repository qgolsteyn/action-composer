import * as React from "react";

type SAppend<T> = (a: T, b: T) => T;

class Semigroup<T> {
  public readonly type: string;
  public readonly value: T;
  public readonly children: Semigroup<T>[];

  private readonly timestamp: number;
  private readonly op: SAppend<T>;

  constructor(
    type: string,
    value: T,
    op: SAppend<T>,
    children: Semigroup<T>[] = []
  ) {
    this.type = type;
    this.value = value;
    this.op = op;
    this.timestamp = performance.now();
    this.children = children;
  }

  public append = (type: string, nextValue: T): Semigroup<T> =>
    new Semigroup(this.type, this.op(this.value, nextValue), this.op, [
      ...this.children,
      new Semigroup(type, nextValue, this.op)
    ]);
}

export const s = <T>(type: string, initialValue: T, op: (a: T, b: T) => T) => {
  return new Semigroup(type, initialValue, op);
};

type StateDefinition = {
  [key: string]: Semigroup<any>;
};
type ExtractSemigroupType<S> = S extends Semigroup<infer T> ? T : never;
type State<S extends StateDefinition> = {
  [K in keyof S]: ExtractSemigroupType<S[K]>
};
type Actions<S extends StateDefinition> = {
  [K in keyof S]: (type: string, nextValue: ExtractSemigroupType<S[K]>) => void
};

export const useState = <S extends StateDefinition>(stateDefinition: S) => {
  const [semigroupState, setSemigroupState] = React.useState(stateDefinition);

  const state = {} as any;
  const actions = {} as any;

  Object.keys(stateDefinition).forEach(key => {
    state[key] = semigroupState[key].value;
    actions[key] = (type: string, nextValue: any) => {
      const nextSemigroup = semigroupState[key].append(type, nextValue);
      console.log(nextSemigroup);
      setSemigroupState({
        ...semigroupState,
        [key]: nextSemigroup
      });
    };
  });

  return [state, actions] as [State<S>, Actions<S>];
};
