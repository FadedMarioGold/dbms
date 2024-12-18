const express = require('express');
const app = express();

const db = require('./Config/db');
const cors = require('cors');

app.use(cors());

app.use(express.json());

// app.post("/sellvehicle/add",(req,res) =>{
//     const type = req.body.type;
//     const phoneno = req.body.phoneNo;
//     const sellername = req.body.sellername;
//     const brandname = req.body.brandName;
//     const yor = req.body.yor;
//     const traveled = req.body.traveled;
//     const prize = req.body.prize;
//     const vehicleno = req.body.vehicleNo;
//     const saleid = null;
//     const buyername = null;
//     const employeename = null;
//     //console.log(type,sellername,brandname,yor,traveled,prize);
//     const methodType = "Sale";
//     db.query(
//         `INSERT INTO ${type} (name,phoneno,brandname,yor,travelled,price,vehicleno) VALUES (?,?,?,?,?,?,?);`,
//         [sellername,phoneno,brandname,yor,traveled,prize,vehicleno],
//         (err,result) =>{
//             if(err) throw err;
//             AddToHistory(methodType,sellername,phoneno,brandname,yor,traveled,prize,vehicleno,buyername,saleid,employeename);
//             res.send(result);
//         }
//     )
// });


// function AddToHistory(methodType,sellername,phoneno,brandname,yor,traveled,prize,vehicleno,buyername,saleid,employeename){
//     db.query(
//         `INSERT INTO history (type,name,phoneno,brandname,yor,travelled,price,vehicleno,buyername,saleid,employeename,datetime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`,
//         [methodType,sellername,phoneno,brandname,yor,traveled,prize,vehicleno,buyername,saleid,employeename,new Date().toDateString()],
//         (err,result) =>{
//             if(err) throw err;
//             //res.send(result);
//         }
//     )
// }
// app.post("/currentvehicle/display",(req,res)=>{
//     const type = req.body.type;
//     db.query(
//         `SELECT * FROM ${type};`,
//         (err,result) =>{
//             if(err) throw err;
//             res.send(result);
//         }
//     )
// });

app.post("/addemployee/add",(req,res)=>{
   const name = req.body.name;
   const phone = req.body.phoneNo;
   const salary = req.body.salary;
   const post = req.body.post;
    db.query(
        `INSERT INTO employeedetails (name,phoneno,salary,post) VALUES (?,?,?,?);`,
        [name,phone,salary,post],
        (err,result) =>{
            if(err) throw err;
            res.send(result);
        }
    )
});

app.post("/employeedetails",(req,res)=>{
    db.query(
        `SELECT * FROM employeedetails;`,
        (err,result) =>{
            if(err) throw err;
            res.send(result);
        }
    )
});

// app.post("/buyvehicle/search",(req,res)=>{
//     const type = req.body.type;
//     const name = req.body.name;
//     const selectedNo = req.body.selectedNo;
//     const id = req.body.id;
//     let employeename = "";
//     db.query(
//         `SELECT name FROM employeedetails where id = ${id}`,
//         (err,result) =>{
//             if(err) throw err;
//             let results = JSON.parse(JSON.stringify(result));
//             //console.log(results[0].name);
//             employeename = results[0].name;
//         }
//     )
//     const methodType = "Buy";
//     db.query(
//         `SELECT * FROM ${type} where vehicleno ='${selectedNo}';`,
//         (err,result) =>{
//             if(err) throw err;
//             //deleteVehicle(result.data);
//             let results = JSON.parse(JSON.stringify(result));
//            AddToHistory(methodType,results[0].name,results[0].phoneno,results[0].brandname,results[0].yor,results[0].travelled,results[0].price,results[0].vehicleno,name,id,employeename);
//             //res.send(result);
//         }
//     )
//     db.query(
//         `DELETE FROM ${type} where vehicleno = '${selectedNo}';`,
//         (err,result) =>{
//             if(err) throw err;
//             res.send(result);
//         }
//     )
// });

// app.post("/history",(req,res)=>{
//     db.query(
//         `SELECT * FROM history;`,
//         (err,result) =>{
//             if(err) throw err;
//             res.send(result);
//         }
//     )
// });
app.post("/currentservices",(req,res)=>{
    db.query(
        `SELECT * FROM currentservices;`,
        (err,result)=>{
            if(err) throw err;
            res.send(result);
        }
    )
})
app.post("/addservices",(req,res)=>{
    const name = req.body.name;
    const vehicleno = req.body.vehicleno;
    const serviceid = req.body.serviceid;
    const employeeid = req.body.employeeid;
    let vehicletype = "";
    let servicetype = "";
    let price = "";
    let employeename = "";
    db.query(
        `SELECT * FROM currentservices where id = ${serviceid}`,
        (err,result)=>{
            if(err) throw err;
            let results = JSON.parse(JSON.stringify(result));
            vehicletype = results[0].vehicletype;
            servicetype = results[0].servicetype;
            price = results[0].price;
            getEmployeeName();

        }
    )
    function getEmployeeName(){
        db.query(
            `SELECT name FROM employeedetails where id = ${employeeid}`,
            (err,result)=>{
                if(err) throw err;
                let results = JSON.parse(JSON.stringify(result));
                employeename = results[0].name;
                addToVehicleUnderServiceTable();
            }
        )
    }
    // function addToVehicleUnderServiceTable(){
    //     db.query(
    //         `INSERT INTO vehicleunderservice (name,vehicletype,servicetype,vehicleno,price,date,employeeid,employeename) VALUES (?,?,?,?,?,?,?,?)`,
    //         [name,vehicletype,servicetype,vehicleno,price,new Date().toDateString(),employeeid,employeename],
    //         (err,result)=>{
    //             if(err) throw err;
    //             res.send(result);
    //         }
    //     )
    // }
    function addToVehicleUnderServiceTable(){
        const formattedDate = new Date().toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD' format
    
        db.query(
            `INSERT INTO vehicleunderservice (name, vehicletype, servicetype, vehicleno, price, date, employeeid, employeename) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, vehicletype, servicetype, vehicleno, price, formattedDate, employeeid, employeename],
            (err, result) => {
                if (err) throw err;
                res.send(result);
            }
        );
    }
})
app.post("/vehiclesunderservice",(req,res)=>{
    db.query(
        `SELECT * FROM vehicleunderservice`,
        (err,result)=>{
            if(err) throw err;
            res.send(result);
        }
    )
})

app.post("/deleteservice",(req,res)=>{
    const vehicleno = req.body.vehicleno;
    db.query(
        `DELETE FROM vehicleunderservice where vehicleno = '${vehicleno}';`,
        (err,result)=>{
            if(err) throw err;
            res.send(result);
        }
    )
})

app.listen(3001,(req,res) =>{
    console.log("Running at 3001 Port");
});