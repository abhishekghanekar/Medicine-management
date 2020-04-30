const express = require("express"); //routing
const mustacheExpress = require("mustache-express"); // for template
const bodyParser = require("body-parser"); // to read data from the form

const app = express();
const mustache = mustacheExpress();

// connecting with database
const { Client } = require("pg");

mustache.cache = null;
app.engine("mustache", mustache);
app.set("view engine", "mustache");

// to know about static folder
app.use(express.static("staticFiles"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/meds", (request, response) => {
    const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "medical",
        password: "Abhishek@2018",
        port: 5432,
    });
    client
        .connect()
        .then(() => {
            // promises -> what to do if connection is done
            console.log("Connection Complete");

            // now sql query
            return client.query("SELECT * FROM meds");
        })
        .then((results) => {
            console.log("results?", results);
            response.render("meds", results);
        });
});

// dashboard

app.get("/dashboard", (request, response) => {
    const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "medical",
        password: "Abhishek@2018",
        port: 5432,
    });
    client
        .connect()
        .then(() => {
            // promises -> what to do if connection is done
            console.log("Connection Complete");

            // now sql query
            return client.query(
                "SELECT SUM(count) FROM meds;SELECT DISTINCT COUNT(brand) FROM meds;"
            );
        })
        .then((results) => {
            console.log("results?", results[0]);
            console.log("results?", results[1]);

            response.render("dashboard", {
                n1: results[0].rows,
                n2: results[1].rows,
            });
        });
});

app.get("/add", (request, response) => {
    response.render("meds-form");
});

// creating new medicine
app.post("/meds/add", (request, response) => {
    console.log("post body", request.body);
    // initializing the client
    const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "medical",
        password: "Abhishek@2018",
        port: 5432,
    });
    client
        .connect()
        .then(() => {
            // promises -> what to do if connection is done
            console.log("Connection Complete");

            // now sql query
            const sql = "INSERT INTO meds (name,count,brand) VALUES ($1,$2,$3) ";
            const params = [
                request.body.name,
                request.body.count,
                request.body.brand,
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("results?", result);
            response.redirect("/meds");
        });
});

// deleting medicine
app.post("/meds/delete/:id", (request, response) => {
    const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "medical",
        password: "Abhishek@2018",
        port: 5432,
    });
    client
        .connect()
        .then(() => {
            // promises -> what to do if connection is done
            console.log("Connection Complete");

            // now sql query
            const sql = "DELETE FROM meds WHERE mid=$1 ";
            const params = [request.params.id];
            return client.query(sql, params);
        })
        .then((result) => {
            response.redirect("/meds");
        });
});

// updating button medicine
app.get("/meds/edit/:id", (request, response) => {
    const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "medical",
        password: "Abhishek@2018",
        port: 5432,
    });
    client
        .connect()
        .then(() => {
            // promises -> what to do if connection is done
            console.log("Connection Complete");

            // now sql query
            const sql = "SELECT * FROM meds WHERE mid=$1 ";
            const params = [request.params.id];
            return client.query(sql, params);
        })
        .then((result) => {
            // console.log("results:", result);
            response.render("meds-edit", { med: result.rows[0] });
        });
});

// update button
app.post("/meds/edit/:id", (request, response) => {
    const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "medical",
        password: "Abhishek@2018",
        port: 5432,
    });
    client
        .connect()
        .then(() => {
            // promises -> what to do if connection is done
            console.log("Connection Complete");

            // now sql query
            const sql = "UPDATE meds SET name=$1, count=$2, brand=$3 WHERE mid=$4 ";
            const params = [
                request.body.name,
                request.body.count,
                request.body.brand,
                request.params.id,
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            // console.log("results:", result);
            response.redirect("/meds");
        });
});
// by default to index page
app.listen(5000, () => {
    console.log("Listening");
});