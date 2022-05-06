const { normalizeText, removeAccents } = require("./helpers");
const fs = require("fs");
module.exports = class jsonDB {
  #path;
  #where_key_value;
  #columns;
  #tempDB;
  constructor(path) {
    this.#path = normalizeText(path);
    console.log([this.getDir, this.getFileName]);
    if (!this.checkPath) {
      this.createPath();
    }
    this.#tempDB = this.get;
  }

  createPath(x = []) {
    if (!fs.existsSync(this.getDir)) {
      fs.mkdirSync(this.getDir, { recursive: true });
    }
    if (!fs.existsSync(`${this.getDir}/${this.getFileName}`)) {
      fs.writeFileSync(
        `${this.getDir}/${this.getFileName}`,
        JSON.stringify(x),
        "utf-8"
      );
    }
  }
  get checkPath() {
    fs.access(this.getPath, (err) => {
      //console.log(`Directory ${err ? "does not exist" : "exists"}`);
    });
    if (fs.existsSync(this.getPath)) {
      //console.log("Directory exists!");
      return true;
    } else {
      //console.log("Directory not found.");
      return false;
    }
  }
  get getPath() {
    return this.#path;
  }
  get getFileName() {
    return this.getPath.substring(this.getPath.lastIndexOf("/") + 1);
  }

  get getDir() {
    return this.getPath.replace(this.getFileName, "");
  }
  insert(registro = {}) {
    this.#tempDB.push(registro);
    fs.writeFileSync(
      `${this.getDir}/${this.getFileName}`,
      JSON.stringify(this.#tempDB),
      "utf-8"
    );
  }
  select(columns = "*") {
    this.#columns = columns == "*" ? columns : columns.split(",");
    return this;
  }
  creatObj(x) {
    var tempObj = new Object();
    for (let i = 0; i < this.#columns.length; i++) {
      const element = this.#columns[i].trim();
      if (typeof x !== "undefined"){
        if (element in x){
          tempObj[element] = x[element];
        }
      }
      
    }
    return tempObj;
  }
  where(key_value = []) {
    this.#where_key_value = key_value;
    return this;
  }
  is_find(x){
    return x.username == "MEE6";
    return true;
  }
  get get() {
    //console.log(typeof this.#columns == "object");
    if (this.checkPath) {
      let data = fs.readFileSync(this.getPath, { encoding: "utf8", flag: "r" });
      data = JSON.parse(data);
      if (typeof this.#columns == "object") {
        if (typeof this.#where_key_value == "object") {
          let temp_data = [];
          console.log(typeof this.#where_key_value);
          let temp_key_value = Object.entries(this.#where_key_value);
          temp_data.push(data.find(this.is_find));
          /*temp_key_value.forEach((element) => {
            console.log(element[0]);
            temp_data.push(data.find((e) => e[element[0]] == element[1]));
          });*/
          console.log("------");
          //console.log(temp_data);
          data = temp_data.map((e) => {
            return this.creatObj(e);
          });
          console.log("------");
        }
        data = data.map((e) => {
          return this.creatObj(e);
        });
      }

      return data;
    } else {
      return [];
    }
  }
};
