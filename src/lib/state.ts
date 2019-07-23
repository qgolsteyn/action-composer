import { hash } from "./hash";

type Operation<T> = (s: T) => T;

class Commit<T> {
  public readonly hash: string;
  public readonly parent: string;
  public readonly operation: Operation<T>;

  constructor(operation: Operation<T>, from: string) {
    this.hash = hash().toString();
    this.operation = operation;
    this.parent = from;
  }
}

export class State<T> {
  private branches: { [name: string]: string } = {};
  private commits: { [hash: string]: Commit<T> } = {};
  private values: { [hash: string]: T } = {};

  constructor(initialValue: T) {
    const initialHash = hash().toString();
    this.values[initialHash] = initialValue;

    const initialCommit = new Commit<T>(s => s, initialHash);
    this.commits[initialCommit.hash] = initialCommit;

    this.branches["master"] = initialCommit.hash;
  }

  public branch = (name: string, from: string) => {
    if (!isNaN(Number(from[0]))) {
      throw new Error(`${name} is not a valid branch name`);
    }

    if (this.branches[from] !== undefined) {
      this.branches[name] = this.branches[from];
    } else if (this.commits[from] !== undefined) {
      this.branches[name] = from;
    } else {
      throw new Error(`"${from}" is neither a branch name or a commit hash`);
    }
  };

  public resolve = (from: string) => {
    if (this.branches[from] !== undefined) {
      return this.resolveBranch(from);
    } else if (this.commits[from] !== undefined) {
      return this.resolveCommit(from);
    } else {
      throw new Error(`"${from}" is neither a branch name or a commit hash`);
    }
  };

  private resolveBranch = (branchName: string): T => {
    return this.resolveCommit(this.branches[branchName]);
  };

  private resolveCommit = (hash: string): T => {
    if (this.values[hash] !== undefined) {
      return this.values[hash];
    } else {
      const commit = this.commits[hash];
      return commit.operation(this.resolveCommit(commit.parent));
    }
  };

  public commit = (from: string, operation: Operation<T>): string => {
    if (this.branches[from] !== undefined) {
      return this.commitFromBranch(from, operation);
    } else if (this.commits[from] !== undefined) {
      return this.commitFromCommit(from, operation);
    } else {
      throw new Error(`"${from}" is neither a branch name or a commit hash`);
    }
  };

  private commitFromBranch = (
    branchName: string,
    operation: Operation<T>
  ): string => {
    const parentHash = this.branches[branchName];
    const hash = this.commitFromCommit(parentHash, operation);
    this.branches[branchName] = hash;
    return hash;
  };

  private commitFromCommit = (
    hash: string,
    operation: Operation<T>
  ): string => {
    const commit = new Commit<T>(operation, hash);
    this.commits[commit.hash] = commit;
    return commit.hash;
  };
}
