const express = require('express');
const todoRouter = express.Router();
// DB CONNECTION
const pool = require('../modules/pool'); 

// GET
// GET allows for all, or specific record by ID.  '0' is all records
todoRouter.get('/:todoId', (req, res) => {
    let orderRequest=req.query.order;
    let id = req.params.todoId;
    let sqlText = '';
    if ( orderRequest == ' ' || orderRequest == undefined ) { orderRequest = 'ASC' }
    if ( id == 0 ) {
        if ( orderRequest == undefined || orderRequest.toUpperCase() == 'ASC') {
            sqlText = `SELECT * FROM tb_task_main WHERE id > $1 ORDER BY due_date ASC;`;
        } else {
            sqlText = `SELECT * FROM tb_task_main WHERE id > $1 ORDER BY due_date DESC;`;
        }
    } else {
        sqlText = `SELECT * FROM tb_task_main WHERE id = $1 ORDER BY due_date;`;
    };
    pool.query(sqlText, [id]) 
        .then((result) => {
            // console.log('GET back', result.rows);
            res.send(result.rows);
        }).catch((error) => {
            console.log('Error from db', error);
            res.sendStatus(500)});
});  
 
// POST
todoRouter.post('/', (req, res) => {
    let completedDate = null;
    let dueDate = null;
    let tododata = req.body;
    let sqlText = `INSERT INTO tb_task_main ("name","comment","create_date","modified_date","due_date","completed_date", "category_color", "status")
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`   
    if ( tododata.completed_date == '' ) {completedDate = null };  
    if ( tododata.due_date == '' ) {
        dueDate = null;
    } else {
        dueDate = tododata.due_date;
    };
    console.log (`duesDate`, dueDate);
    // $1 $2 $3 $4 and $5 are filled in by the array below the query  
    pool.query(sqlText, [tododata.name, tododata.comment, tododata.create_date, tododata.modified_date, dueDate, completedDate, tododata.category_color, tododata.status])
        .then( (response) => {
            res.sendStatus(201) // send OK status, insert complete
        }) 
        .catch((error)=>{
            console.log('error from db', error); 
            // res.sendStatus()
        })
});

// PUT
todoRouter.put('/:todoId', (req, res) => {
    let id = req.params.todoId;
    let payload = req.body;
    let sqlText = `UPDATE tb_task_main SET name=$2, comment=$3, modified_date=$4, due_date=$5, category_color=$6, status=$7 where id=$1;`; 
    pool.query( sqlText, [id, payload.name, payload.comment, payload.modified_date, payload.due_date, payload.category_color, payload.status] )
    .then( (result) => {
            res.sendStatus(200);
    })
    .catch( (error) => {
        console.log('Error from db:', error);
        res.sendStatus(500);
    })
});

// DELETE  
todoRouter.delete('/:todoId', (req, res) => { 
    let id = req.params.todoId;
    let sqlText = `DELETE FROM tb_task_main WHERE id=$1;`; 
    pool.query(sqlText, [id])
    .then( (result) => {
        res.sendStatus(200)
    }) 
    .catch((error)=>{
        console.log('error from db', error); 
        res.sendStatus(500)
    })
})

module.exports = todoRouter;  

