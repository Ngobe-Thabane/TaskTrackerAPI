import express from 'express';
import { hashPassword , comparePassword, generateToken} from '../middlewares/AuthMiddleware.js';
import client from '../model/db.js';

const authRoutes = express.Router();

authRoutes.post('/register', async(req, res)=>{

  const {name, email, password } = req.body;

  if (!name || !email || !password){
    return res.status(400).send({message:'all fields must be filled'})
  }
  
  const userExist = await client.query('SELECT email FROM users WHERE email=$1', [email]);
  
  if(userExist.rowCount !== 0){
    return res.status(400).send({message:'Something went wrong'})
  }

  const passwordHash = hashPassword(password);
  
  const {rows} = await client.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *', [name, email, passwordHash]);

  const token = generateToken({id:rows[0].id, name:rows[0].name, email:rows[0].email});
  return res.status(201).send({token:token});
  
})


authRoutes.post('/login', async(req, res)=>{

  const {email, password} = req.body;
  if(!email || !password){
    return res.status(400).send({message:'all fields must be filled'})
  }

  const {rows} = await client.query('SELECT * FROM USERS WHERE email=$1', [email]);

  if(rows.length === 0){
    return res.status(400).send({message: 'email or password incorrect'})
  }

  if(comparePassword(password, rows[0].password)){
    const token = generateToken({id:rows[0].id, name:rows[0].name, email:rows[0].email})
    return res.status(200).send({token:token})
  }
})


export default authRoutes;
