export interface Action {
  hash: string;
  type: string;
  payload: any;
  parent: string | undefined;
}

const createAction = (
  parent: string | undefined,
  type: string,
  payload?: any
): Action => {
  return {
    hash: hash(),
    parent,
    type,
    payload
  };
};

export interface Store<T> {
  get: (from: string) => T;
  dispatch: (onto: string, type: string, payload?: any) => string;
  branch: (name: string, from: string) => void;
  apply: (from: string, onto: string) => void;
}

export const createStore = <T>(reducer: (s: T, action: Action) => T) => {
  const actions: { [hash: string]: Action } = {};
  const sequences: { [name: string]: string } = {};

  const normalizeToHash = (from: string) => {
    if (actions[from] !== undefined) {
      return from;
    } else if (sequences[from] !== undefined) {
      return sequences[from];
    } else {
      throw new Error(`${from} is not a valid hash or sequence name`);
    }
  };

  const updateSequence = (from: string, newHash: string) => {
    if (sequences[from] !== undefined) {
      sequences[from] = newHash;
    }
  };

  const findSequenceHead = (from: string, onto: string) => {
    const visited: { [hash: string]: boolean } = {};

    let currentHash: string | undefined = onto;
    while (currentHash !== undefined) {
      visited[currentHash] = true;
      currentHash = actions[currentHash].parent;
    }

    currentHash = from;
    let childHash = null;
    while (!visited[currentHash]) {
      childHash = currentHash;
      currentHash = actions[currentHash].parent;
      if (currentHash === undefined) return null;
    }

    return childHash;
  };

  const resolveActions = (hash: string): T => {
    const action = actions[hash];
    const parentState =
      action.parent !== undefined ? resolveActions(action.parent) : ({} as any);
    return reducer(parentState, action);
  };

  const initialAction = createAction(undefined, "INITIALIZE_STATE");
  actions[initialAction.hash] = initialAction;

  sequences["main"] = initialAction.hash;

  const store: Store<T> = {
    get: from => {
      const hash = normalizeToHash(from);
      return resolveActions(hash);
    },
    dispatch: (onto, type, payload) => {
      const hash = normalizeToHash(onto);
      const action = createAction(hash, type, payload);

      actions[action.hash] = action;

      updateSequence(onto, action.hash);

      return action.hash;
    },
    branch: (name, from) => {
      sequences[name] = sequences[from];
    },
    apply: (from, onto) => {
      const hashFrom = normalizeToHash(from);
      const hashOnto = normalizeToHash(onto);

      const head = findSequenceHead(hashFrom, hashOnto);

      if (head !== null) {
        actions[head].parent = hashOnto;
        updateSequence(onto, hashFrom);
      } else {
        console.warn(`Unable to apply ${from} to ${onto}`);
      }
    }
  };

  Object.freeze(store);

  return store;
};

let count = 0;
export const hash = () => {
  return (count++).toString();
};
