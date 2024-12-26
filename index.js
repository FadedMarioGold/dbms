const express = require('express');
const app = express();
const db = require('./Config/db');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Utility function to log actions to the history table
function logHistory(action, details) {
    console.log("Attempting to log history:", action, details);
    db.query(
        `INSERT INTO history (action, details) VALUES (?, ?)`,
        [action, JSON.stringify(details)],
        (err) => {
            if (err) {
                console.error("Error logging to history:", err);
            } else {
                console.log("Successfully logged to history:", action, details);
            }
        }
    );
}

// Route: Add Employee
app.post("/addemployee/add", (req, res) => {
    const { name, phoneNo: phone, salary, post } = req.body;

    console.log("Request received to add employee:", { name, phone, salary, post });

    db.query(
        `INSERT INTO employeedetails (name, phoneno, salary, post) VALUES (?, ?, ?, ?);`,
        [name, phone, salary, post],
        (err, result) => {
            if (err) {
                console.error("Error adding employee:", err);
                res.status(500).send("Error adding employee");
                return;
            }

            // Log action to history
            const details = { name, phone, salary, post };
            logHistory("Add Employee", details);

            res.send(result);
        }
    );
});

// Route: Get Employee Details
app.post("/employeedetails", (req, res) => {
    db.query(`SELECT * FROM employeedetails;`, (err, result) => {
        if (err) {
            console.error("Error fetching employee details:", err);
            res.status(500).send("Error fetching employee details");
        } else {
            res.send(result);
        }
    });
});

// Route: Add Service
app.post("/addservices", (req, res) => {
    const { name, vehicleno, serviceid, employeeid } = req.body;

    db.query(
        `SELECT * FROM currentservices WHERE id = ?`,
        [serviceid],
        (err, serviceResult) => {
            if (err) {
                console.error("Error fetching service details:", err);
                res.status(500).send("Error fetching service details");
                return;
            }

            const service = serviceResult[0];
            const { vehicletype, servicetype, price } = service;

            db.query(
                `SELECT name FROM employeedetails WHERE id = ?`,
                [employeeid],
                (err, employeeResult) => {
                    if (err) {
                        console.error("Error fetching employee details:", err);
                        res.status(500).send("Error fetching employee details");
                        return;
                    }

                    const employeename = employeeResult[0].name;
                    const formattedDate = new Date().toISOString().split("T")[0];

                    db.query(
                        `INSERT INTO vehicleunderservice (name, vehicletype, servicetype, vehicleno, price, date, employeeid, employeename) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [name, vehicletype, servicetype, vehicleno, price, formattedDate, employeeid, employeename],
                        (err, result) => {
                            if (err) {
                                console.error("Error adding service:", err);
                                res.status(500).send("Error adding service");
                                return;
                            }

                            // Log action to history
                            logHistory("Add Service", {
                                name,
                                vehicleno,
                                servicetype,
                                employeename,
                            });

                            res.send(result);
                        }
                    );
                }
            );
        }
    );
});

// Route: Delete Service
app.post("/deleteservice", (req, res) => {
    const { vehicleno } = req.body;

    db.query(
        `DELETE FROM vehicleunderservice WHERE vehicleno = ?`,
        [vehicleno],
        (err, result) => {
            if (err) {
                console.error("Error deleting service:", err);
                res.status(500).send("Error deleting service");
                return;
            }

            // Log action to history
            logHistory("Delete Service", { vehicleno });

            res.send(result);
        }
    );
});

// Route: Get Services Undergoing Maintenance
app.post("/vehiclesunderservice", (req, res) => {
    db.query(`SELECT * FROM vehicleunderservice`, (err, result) => {
        if (err) {
            console.error("Error fetching vehicles under service:", err);
            res.status(500).send("Error fetching vehicles under service");
        } else {
            res.send(result);
        }
    });
});

// Route: Get Current Services
app.post("/currentservices", (req, res) => {
    db.query(`SELECT * FROM currentservices`, (err, result) => {
        if (err) {
            console.error("Error fetching current services:", err);
            res.status(500).send("Error fetching current services");
        } else {
            res.send(result);
        }
    });
});

// Route: Get History
app.post("/history", (req, res) => {
    db.query(`SELECT * FROM history ORDER BY timestamp DESC`, (err, result) => {
        if (err) {
            console.error("Error querying history:", err);
            res.status(500).send("Error querying history");
        } else {
            res.send(result);
        }
    });
});

// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
