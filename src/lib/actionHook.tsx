import * as React from "react";

type MIdentity<P> = P;
type MAppend<P> = (a: P, b: P) => P;
type Monoid<P> = [MIdentity<P>, MAppend<P>];

interface State {
  [key: string]: any;
}

export type StateDefinition<S extends State> = { [K in keyof S]: Monoid<S[K]> };
type StateActions<S extends State> = { [K in keyof S]: (value: S[K]) => void };

export const useActions = <S extends State>(
  stateDefinition: StateDefinition<S>
) => {
  const initialState = React.useMemo(() => {
    const s: any = {};
    Object.keys(stateDefinition).forEach(
      key => (s[key] = stateDefinition[key][0])
    );
    return s as S;
  }, [stateDefinition]);

  const [state, setState] = React.useState(initialState);

  const actions = React.useMemo(() => {
    const a: any = {};
    Object.keys(stateDefinition).forEach(
      key =>
        (a[key] = (val: any) =>
          setState({
            ...state,
            [key]: stateDefinition[key][1](state[key], val)
          }))
    );
    return a as StateActions<S>;
  }, [state, stateDefinition]);

  return [state, actions] as [S, StateActions<S>];
};
