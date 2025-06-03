import {MongoClient} from 'mongodb';

async function main() {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db = client.db('automotive_db');
    const res = await db.collection('classes').find({}).toArray();
    console.log(res); // <-- ici tu dois voir des documents, sinon c'est vide
    client.close();
}

main();