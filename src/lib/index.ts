export type Node = { [key: string]: Node | Leaf };
export type Leaf = number | string | boolean;

export interface Commit<T extends Node> {
  hash: string;
  patch: (s: T) => T;
  parent: string | undefined;
}

const createCommit = <T extends Node>(
  patch: (s: T) => T,
  parent: string | undefined
): Commit<T> => {
  return {
    hash: hash(),
    patch,
    parent
  };
};

export interface Store<T extends Node> {
  get: (from: string) => T;
  commit: (patch: (s: T) => T, from: string) => string;
  branch: (name: string, from: string) => void;
  apply: (from: string, onto: string) => void;
}

export const createStore = <T extends Node>(initialState: T) => {
  const commits: { [hash: string]: Commit<T> } = {};
  const branches: { [name: string]: string } = {};

  const normalizeToHash = (from: string) => {
    if (commits[from] !== undefined) {
      return from;
    } else if (branches[from] !== undefined) {
      return branches[from];
    } else {
      throw new Error(`${from} is not a valid hash or branch name`);
    }
  };

  const updateBranch = (from: string, newHash: string) => {
    if (branches[from] !== undefined) {
      branches[from] = newHash;
    }
  };

  const findBranchHead = (from: string, onto: string) => {
    const visited: { [hash: string]: boolean } = {};

    let currentHash: string | undefined = onto;
    while (currentHash !== undefined) {
      visited[currentHash] = true;
      currentHash = commits[currentHash].parent;
    }

    currentHash = from;
    let childHash = null;
    while (!visited[currentHash]) {
      childHash = currentHash;
      currentHash = commits[currentHash].parent;
      if (currentHash === undefined) return null;
    }

    return childHash;
  };

  const resolveCommit = (hash: string): T => {
    const commit = commits[hash];
    return commit.patch(
      commit.parent !== undefined ? resolveCommit(commit.parent) : initialState
    );
  };

  const initialCommit = createCommit((s: T) => s, undefined);
  commits[initialCommit.hash] = initialCommit;

  branches["master"] = initialCommit.hash;

  const store: Store<T> = {
    get: from => {
      const hash = normalizeToHash(from);
      return resolveCommit(hash);
    },
    commit: (patch, from) => {
      const hash = normalizeToHash(from);
      const commit = createCommit(patch, hash);

      commits[commit.hash] = commit;

      updateBranch(from, commit.hash);

      return commit.hash;
    },
    branch: (name, from) => {
      branches[name] = branches[from];
    },
    apply: (from, onto) => {
      const hashFrom = normalizeToHash(from);
      const hashOnto = normalizeToHash(onto);

      const head = findBranchHead(hashFrom, hashOnto);

      if (head !== null) {
        commits[head].parent = hashOnto;
        updateBranch(onto, hashFrom);
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
