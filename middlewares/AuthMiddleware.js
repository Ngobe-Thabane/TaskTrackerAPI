import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken';
import { config } from 'dotenv';

config({path:'./configs/.env'})
const saltRounds = 10;

export function hashPassword(password){
  
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export function comparePassword(password, hash){
  return bcrypt.compareSync(password, hash)
}

export function generateToken(payload){
  return jsonwebtoken.sign(payload, process.env.SECRETE)
}

export function verifyKey(token){
  const data = jsonwebtoken.verify(token, process.env.SECRETE);
  return data;
}