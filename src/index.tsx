import { createStore } from "./lib";

const store = createStore({
  name: "",
  text: "",
  location: "",
  author: ""
});

console.log(store.get("master"));

store.commit(
  s => ({
    ...s,
    text: "Hello World!"
  }),
  "master"
);

console.log(store.get("master"));

store.branch("editMetadata", "master");

const name = "My home page";

for (let i = 1; i < name.length; i++) {
  store.commit(
    s => ({
      ...s,
      name: name.substr(0, i)
    }),
    "editMetadata"
  );
}

store.branch("editAuthor", "editMetadata");

store.commit(
  s => ({
    ...s,
    author: "Quentin"
  }),
  "editAuthor"
);

store.commit(
  s => ({
    ...s,
    author: "Pierre"
  }),
  "editAuthor"
);

store.apply("editAuthor", "editMetadata");

store.commit(
  s => ({
    ...s,
    name: "My home page 2"
  }),
  "editMetadata"
);

console.log(store.get("master"));

store.apply("editMetadata", "master");

console.log(store.get("master"));
