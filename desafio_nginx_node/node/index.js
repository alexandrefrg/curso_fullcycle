const express = require("express");
const app = express();
const port = 80;
const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};

const mysql = require("mysql");
const connection = mysql.createConnection(config);

app.get("/", (req, res) => {
  const insert_sql = `INSERT INTO people(name) values ('Novo nome')`;
  connection.query(insert_sql);
  connection.end;
  var txt = "<h1>Full Cycle</h1>\n";
  const select_sql = `SELECT name FROM people`;
  connection.query(select_sql, function (err, result, fields) {
    if (err) throw err;
    txt += "<ul>\n";
    result.forEach((_, index) => {
      txt += "<li>" + result[index].name + "</li>\n";
    });
    txt += "</ul>";
    res.send(txt);
  });
  connection.end;
});

app.listen(port, () => {
  console.log("Rodando na porta " + port);
});
