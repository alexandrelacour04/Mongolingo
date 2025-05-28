const config = {
    mongodb: {
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            directConnection: true
        }
    },
    databases: [
        {
            name: "library",
            uri: "mongodb://localhost:27017/library_db",
            description: "Base de données de la bibliothèque"
        },
        {
            name: "automotive",
            uri: "mongodb://localhost:27017/automotive_db",
            description: "Base de données automobile"
        },
        {
            name: "events",
            uri: "mongodb://localhost:27017/events_db",
            description: "Base de données des événements"
        }
    ]
};

module.exports = config;