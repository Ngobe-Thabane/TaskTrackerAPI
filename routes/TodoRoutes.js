import express from 'express';
import { verifyKey } from '../middlewares/AuthMiddleware.js';
import client from '../model/db.js';

const todoRoutes = express.Router();

const verifyToken = (req, res, next)=>{

  const token = req.headers.token;
  try {
    req.user = verifyKey(token);
    return next();
  }
  catch{
    return res.status(401).send({message:'Unauthorized'})
  }
  
}

todoRoutes.post('/todos', verifyToken ,async(req, res)=>{

  const {title, description} = req.body;
  const user = req.user;

  if( title == '' || description == ''){
    return res.status(400).send({message:'all fields must be filled'});
  }
  const todo = await client.query('INSERT INTO todos(title, content, user_id) VALUES($1,$2,$3) RETURNING *', [title, description, user.id])
  
  return res.status(201).send(todo.rows)    
  
});

todoRoutes.put('/todos/:id', verifyToken, async(req, res)=>{
  
  const {id} = req.params;
  const {title, description} = req.body;
  const user = req.user;
  
  if((title === '' && description === '')|| id === ''){
    return res.status(400).send({message:'all fields must be filled'});
  }
  
  const todoItem = await client.query('SELECT * FROM todos WHERE id=$1', [id]);
  
  if(todoItem.rowCount === 0) return res.status(404).send({message:'Todo does not exist'});
  if(todoItem.rows[0].user_id !== user.id) return res.status(403).send({message:'Forbidden'});

  const updateTodo = await client.query('UPDATE todos SET title=$1, content=$2 WHERE id=$3 RETURNING *', [title, description, id]);

  return res.status(201).send(updateTodo.rows)

})

todoRoutes.delete('/todos/:id',verifyToken ,async(req, res)=>{

  const user = req.user;
  const {id} = req.params;

  if(id == ''){
    return res.status(400).send({message:'id invalid'})
  }

  const todoItem = await client.query('SELECT * FROM todos WHERE id=$1', [id]);

  if(todoItem.rowCount === 0) return res.status(404).send({message:'Todo does not exist'});
  if(todoItem.rows[0].user_id !== user.id) return res.status(403).send({message:'Forbidden'});

  await client.query('DELETE FROM todos WHERE id=$1', [id]);

  return res.status(204).send('');
})


todoRoutes.get('/todos', async(req, res)=>{
  const todos = await client.query('SELECT * FROM todos');
  return res.status(200).send(todos.rows);
})

export default todoRoutes;