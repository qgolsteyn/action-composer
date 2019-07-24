import { createStore } from "./lib";

const store = createStore(
  (s = { name: "", text: "", location: "", author: "" }, a) => {
    switch (a.type) {
      case "SET_NAME":
        return {
          ...s,
          name: a.payload
        };
      case "SET_AUTHOR":
        return {
          ...s,
          author: a.payload
        };
      case "SET_TEXT":
        return {
          ...s,
          text: a.payload
        };
      case "SET_LOCATION":
        return {
          ...s,
          location: a.payload
        };
      default:
        return s;
    }
  }
);

console.log(store.get("main"));

store.dispatch("main", "SET_TEXT", "Hello World!");

console.log(store.get("main"));

store.branch("editMetadata", "main");

const name = "My home page";

for (let i = 1; i < name.length; i++) {
  store.dispatch("editMetadata", "SET_NAME", name);
}

store.branch("editAuthor", "editMetadata");

const hash = store.dispatch("editAuthor", "SET_AUTHOR", "Quentin");

store.dispatch("editAuthor", "SET_AUTHOR", "Pierre");

store.apply("editAuthor", "editMetadata");

store.dispatch("editMetadata", "SET_NAME", "My home page 2");

store.dispatch("main", "SET_LOCATION", "important.txt");

console.log(store.get("main"));

store.apply("editMetadata", "main");

console.log(store.get("main"));

console.log(store.get(hash));
