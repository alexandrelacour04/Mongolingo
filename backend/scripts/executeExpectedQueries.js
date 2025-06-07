const {MongoClient} = require('mongodb');
const automotive = require('../data/automotive');

const uri = 'mongodb://localhost:27017/automotive'; // adapte l'URI selon ton environnement

// Petit parser pour transformer l'expectedQuery en requête executable
function parseQuery(queryString) {
    // pour find ex: db.members.find({ membershipType: 'Premium' })
    let match = queryString.match(/^db\.(\w+)\.find\((.*)\)(\.sort\((.*)\))?$/);
    if (match) {
        const collection = match[1];
        const filter = match[2] ? eval('(' + match[2] + ')') : {};
        const sort = match[4] ? eval('(' + match[4] + ')') : undefined;
        return {type: 'find', collection, filter, sort};
    }

    // pour aggregate ex: db.bookings.aggregate([ ... ])
    match = queryString.match(/^db\.(\w+)\.aggregate\((\[.*\])\)$/s);
    if (match) {
        const collection = match[1];
        // Attention : utiliser eval ou JSON.parse ici suppose que les pipelines sont bien formés JS/JSON.
        let pipeline = null;
        try {
            pipeline = eval(match[2]);
        } catch (e) {
            // gestion d'erreur simple
            pipeline = [];
        }
        return {type: 'aggregate', collection, pipeline};
    }
    return null;
}

async function executeExpectedQueries() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db();

        for (const q of automotive.questions) {
            const parsed = parseQuery(q.expectedQuery);
            if (!parsed) {
                console.log(`[NON TRAITÉ] ${q.question}`);
                continue;
            }

            let result;
            if (parsed.type === 'find') {
                let cursor = db.collection(parsed.collection).find(parsed.filter);
                if (parsed.sort) cursor = cursor.sort(parsed.sort);
                result = await cursor.toArray();
            } else if (parsed.type === 'aggregate') {
                result = await db.collection(parsed.collection).aggregate(parsed.pipeline).toArray();
            }
            console.log(`# Question : ${q.question}`);
            console.log('- Résultat:', JSON.stringify(result, null, 2));
        }
    } catch (err) {
        console.error('Erreur:', err);
    } finally {
        await client.close();
    }
}

executeExpectedQueries();