import FileSystem from "./filesystem";

const testFS = new FileSystem('C:\\Users\\henry\\workspace\\playground\\editor-playground');

testFS.readProject().then((result) => console.log(result));