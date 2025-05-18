import {Client} from 'pg';

const client = new Client({
  user:"postgres",
  host: "172.17.0.1",
  password: "tasklist",
  database: "postgres",
  port: 5432
})

client.connect();
export default client;