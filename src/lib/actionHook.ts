import * as React from "react";

type State = {};
type Action = { [key: string]: (payload: any) => void };
type External = Action;

interface Dispatch<S extends State, A extends Action> {
  state: S;
  action: A;
}

type CallbackFunction<S extends State> = (newState: S) => void;
type ActionDefinitionFunction<S extends State, A extends Action> = (
  dispatch: Dispatch<S, A>,
  payload: any
) => S | [S, CallbackFunction<S>] | void;
export type ActionDefinitions<
  S extends State,
  A extends Action,
  E extends External = {}
> = { [K in keyof A]: ActionDefinitionFunction<S, A & E> };

export const useActions = <
  S extends State,
  A extends Action,
  E extends External
>(
  actionDefinitions: ActionDefinitions<S, A, E>,
  initialState: S,
  externals: E
) => {
  const [state, setState] = React.useState(initialState);

  const instrumentedExternals: E = React.useMemo(() => {
    const e: any = {};
    Object.keys(externals).forEach(key => {
      e[key] = (payload: any) => {
        (window as any).events.push({ type: key, payload });
        externals[key](payload);
      };
    });
    return e;
  }, [externals]);

  const actions: A & E = React.useMemo(() => {
    const a: any = {};
    Object.keys(actionDefinitions).forEach(key => {
      a[key] = (payload: any) => {
        (window as any).events.push({ type: key, payload, state });
        const stateOrArray = actionDefinitions[key](
          { state, action: { ...actions, ...instrumentedExternals } },
          payload
        );
        if (typeof stateOrArray === "object") {
          if (Array.isArray(stateOrArray)) {
            const newState = stateOrArray[0];
            setState(newState);
            stateOrArray[1](newState);
          } else {
            setState(stateOrArray);
          }
        }
      };
    });
    return a;
  }, [state, actionDefinitions, instrumentedExternals]);

  return [state, actions] as [S, A];
};
