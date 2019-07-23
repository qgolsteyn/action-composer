import { State } from "./lib/state";

const add = (s: number) => s + 1;

const state = new State(0);

state.commit("master", add);
state.commit("master", add);
state.commit("master", add);

state.branch("test", "master");

state.commit("master", add);
state.commit("master", add);

console.log(state.resolve("master"));
console.log(state.resolve("test"));

console.log(state);
