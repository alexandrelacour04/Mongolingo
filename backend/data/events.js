module.exports = {
    name: "events",
    description: "Gestion d'organisation d'événements",
    collections: {
        events: [
            {
                eventId: "EV001",
                title: "Conférence Tech 2025",
                date: "2025-06-01",
                location: "Paris",
                capacity: 100,
                type: "Conférence"
            },
            {
                eventId: "EV002",
                title: "Atelier MongoDB",
                date: "2025-07-15",
                location: "Lyon",
                capacity: 50,
                type: "Atelier"
            },
            {
                eventId: "EV003",
                title: "Salon de l'Innovation",
                date: "2025-08-01",
                location: "Marseille",
                capacity: 200,
                type: "Salon"
            },
            {
                eventId: "EV004",
                title: "Hackathon IA",
                date: "2025-09-10",
                location: "Paris",
                capacity: 80,
                type: "Hackathon"
            },
            {
                eventId: "EV005",
                title: "Séminaire Data",
                date: "2025-10-05",
                location: "Lyon",
                capacity: 60,
                type: "Séminaire"
            }
        ],
        attendees: [
            {attendeeId: "AT001", name: "Alice Durand", email: "alice.durand@example.com", phone: "0123456789"},
            {attendeeId: "AT002", name: "Bob Martin", email: "bob.martin@example.com", phone: "0987654321"},
            {attendeeId: "AT003", name: "Clara Petit", email: "clara.petit@example.com", phone: "0234567890"},
            {attendeeId: "AT004", name: "David Roux", email: "david.roux@example.com", phone: "0345678901"},
            {attendeeId: "AT005", name: "Emma Blanc", email: "emma.blanc@example.com", phone: "0456789012"}
        ],
        registrations: [
            {eventId: "EV001", attendeeId: "AT001", registrationDate: "2025-01-10"},
            {eventId: "EV002", attendeeId: "AT002", registrationDate: "2025-02-01"},
            {eventId: "EV003", attendeeId: "AT003", registrationDate: "2025-03-15"},
            {eventId: "EV004", attendeeId: "AT004", registrationDate: "2025-04-20"},
            {eventId: "EV005", attendeeId: "AT005", registrationDate: "2025-05-01"}
        ]
    },
    questions: [
        {
            difficulty: "moyen",
            question: "Lister tous les événements de type 'Conférence'.",
            expectedQuery: "db.events.find({ type: 'Conférence' })",
            hints: ["Filtrez sur le champ type", "Collection events"],
            points: 15
        },
        {
            difficulty: "moyen",
            question: "Trouver le nombre total de participants par événement.",
            expectedQuery: "db.registrations.aggregate([{$group: {_id: '$eventId', totalAttendees: {$sum: 1}}}, {$sort: {_id: 1}}])",
            hints: ["Groupez par eventId", "Utilisez $sum pour compter"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Lister les noms des participants inscrits au 'Salon de l'Innovation'.",
            expectedQuery: "db.registrations.aggregate([{$match: {eventId: 'EV003'}}, {$lookup: {from: 'attendees', localField: 'attendeeId', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$project: {name: '$attendee.name'}}])",
            hints: ["Filtrez par eventId", "Joignez avec attendees", "Projetez le nom"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Trouver les événements à Paris avec une capacité supérieure à 80.",
            expectedQuery: "db.events.find({ location: 'Paris', capacity: {$gt: 80} })",
            hints: ["Filtrez sur location et capacity", "Collection events"],
            points: 15
        },
        {
            difficulty: "moyen",
            question: "Lister les participants inscrits avant le 1er mars 2025.",
            expectedQuery: "db.registrations.aggregate([{$match: {registrationDate: {$lt: '2025-03-01'}}}, {$lookup: {from: 'attendees', localField: 'attendeeId', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$project: {name: '$attendee.name'}}])",
            hints: ["Filtrez par date", "Joignez avec attendees"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Trouver les événements sans inscriptions.",
            expectedQuery: "db.events.aggregate([{$lookup: {from: 'registrations', localField: 'eventId', foreignField: 'eventId', as: 'regs'}}, {$match: {regs: {$size: 0}}}, {$project: {title: 1, date: 1}}])",
            hints: ["Joignez avec registrations", "Filtrez les événements sans inscriptions"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Lister les numéros de téléphone des participants inscrits à plusieurs événements.",
            expectedQuery: "db.registrations.aggregate([{$group: {_id: '$attendeeId', count: {$sum: 1}}}, {$match: {count: {$gt: 1}}}, {$lookup: {from: 'attendees', localField: '_id', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$project: {phone: '$attendee.phone'}}])",
            hints: ["Groupez par attendeeId", "Filtrez par multiples inscriptions", "Joignez avec attendees"],
            points: 25
        },
        {
            difficulty: "moyen",
            question: "Trouver le nombre total d'inscriptions par type d'événement.",
            expectedQuery: "db.registrations.aggregate([{$lookup: {from: 'events', localField: 'eventId', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$group: {_id: '$event.type', totalRegistrations: {$sum: 1}}}, {$sort: {_id: 1}}])",
            hints: ["Joignez avec events", "Groupez par type"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Lister les événements ayant lieu en août 2025.",
            expectedQuery: "db.events.find({ date: {$regex: '^2025-08'} })",
            hints: ["Utilisez $regex pour le mois", "Collection events"],
            points: 15
        },
        {
            difficulty: "moyen",
            question: "Trouver les participants ayant un email contenant 'example.com'.",
            expectedQuery: "db.attendees.find({ email: {$regex: 'example.com', $options: 'i'} })",
            hints: ["Utilisez $regex pour l'email", "Ignorez la casse"],
            points: 15
        },
        {
            difficulty: "moyen",
            question: "Lister les titres des événements auxquels 'Alice Durand' est inscrite.",
            expectedQuery: "db.registrations.aggregate([{$lookup: {from: 'attendees', localField: 'attendeeId', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$match: {'attendee.name': 'Alice Durand'}}, {$lookup: {from: 'events', localField: 'eventId', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$project: {title: '$event.title'}}])",
            hints: ["Filtrez par nom", "Joignez avec events"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Trouver le nombre total d'inscriptions en avril 2025.",
            expectedQuery: "db.registrations.aggregate([{$match: {registrationDate: {$regex: '^2025-04'}}}, {$count: 'totalRegistrations'}])",
            hints: ["Filtrez par mois", "Utilisez $count"],
            points: 15
        },
        {
            difficulty: "moyen",
            question: "Lister les événements avec moins de 20 inscriptions.",
            expectedQuery: "db.registrations.aggregate([{$group: {_id: '$eventId', total: {$sum: 1}}}, {$match: {total: {$lt: 20}}}, {$lookup: {from: 'events', localField: '_id', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$project: {title: '$event.title'}}])",
            hints: ["Groupez par eventId", "Filtrez par total", "Joignez avec events"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Trouver les participants inscrits à des événements de type 'Hackathon'.",
            expectedQuery: "db.registrations.aggregate([{$lookup: {from: 'events', localField: 'eventId', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$match: {'event.type': 'Hackathon'}}, {$lookup: {from: 'attendees', localField: 'attendeeId', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$project: {name: '$attendee.name'}}])",
            hints: ["Filtrez par type", "Joignez avec events et attendees"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Lister les événements triés par capacité décroissante.",
            expectedQuery: "db.events.find().sort({ capacity: -1 })",
            hints: ["Utilisez sort avec -1", "Collection events"],
            points: 15
        },
        {
            difficulty: "moyen",
            question: "Trouver le premier participant inscrit à chaque événement.",
            expectedQuery: "db.registrations.aggregate([{$sort: {eventId: 1, registrationDate: 1}}, {$group: {_id: '$eventId', attendeeId: {$first: '$attendeeId'}}}, {$lookup: {from: 'attendees', localField: 'attendeeId', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$lookup: {from: 'events', localField: '_id', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$project: {eventTitle: '$event.title', attendeeName: '$attendee.name'}}])",
            hints: ["Triez par date", "Utilisez $first", "Joignez avec attendees et events"],
            points: 25
        },
        {
            difficulty: "moyen",
            question: "Lister les événements dont le titre contient 'Data'.",
            expectedQuery: "db.events.find({ title: {$regex: 'Data', $options: 'i'} })",
            hints: ["Utilisez $regex pour le titre", "Ignorez la casse"],
            points: 15
        },
        {
            difficulty: "moyen",
            question: "Trouver le nombre d'inscriptions par événement, trié par nombre décroissant.",
            expectedQuery: "db.registrations.aggregate([{$group: {_id: '$eventId', total: {$sum: 1}}}, {$lookup: {from: 'events', localField: '_id', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$project: {title: '$event.title', total: 1}}, {$sort: {total: -1}}])",
            hints: ["Groupez par eventId", "Joignez avec events", "Triez par total"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Lister les participants non inscrits à un événement.",
            expectedQuery: "db.attendees.aggregate([{$lookup: {from: 'registrations', localField: 'attendeeId', foreignField: 'attendeeId', as: 'regs'}}, {$match: {regs: {$size: 0}}}, {$project: {name: 1, email: 1}}])",
            hints: ["Joignez avec registrations", "Filtrez ceux sans inscriptions"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Trouver les événements ayant atteint leur capacité.",
            expectedQuery: "db.registrations.aggregate([{$group: {_id: '$eventId', total: {$sum: 1}}}, {$lookup: {from: 'events', localField: '_id', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$match: {$expr: {$eq: ['$total', '$event.capacity']}}}, {$project: {title: '$event.title'}}])",
            hints: ["Comptez les inscriptions", "Comparez avec la capacité", "Joignez avec events"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Lister les participants inscrits à des événements en 2025.",
            expectedQuery: "db.registrations.aggregate([{$lookup: {from: 'events', localField: 'eventId', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$match: {'event.date': {$regex: '^2025'}}}, {$lookup: {from: 'attendees', localField: 'attendeeId', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$project: {name: '$attendee.name'}}])",
            hints: ["Filtrez par année", "Joignez avec events et attendees"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Trouver le dernier événement auquel chaque participant s'est inscrit.",
            expectedQuery: "db.registrations.aggregate([{$sort: {attendeeId: 1, registrationDate: -1}}, {$group: {_id: '$attendeeId', eventId: {$first: '$eventId'}}}, {$lookup: {from: 'events', localField: 'eventId', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$lookup: {from: 'attendees', localField: '_id', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$project: {name: '$attendee.name', eventTitle: '$event.title'}}])",
            hints: ["Triez par date décroissante", "Utilisez $first", "Joignez avec events et attendees"],
            points: 25
        },
        {
            difficulty: "moyen",
            question: "Lister les événements ayant moins de 50% de leur capacité remplie.",
            expectedQuery: "db.registrations.aggregate([{$group: {_id: '$eventId', total: {$sum: 1}}}, {$lookup: {from: 'events', localField: '_id', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$match: {$expr: {$lt: ['$total', {$divide: ['$event.capacity', 2]}]}}}, {$project: {title: '$event.title'}}])",
            hints: ["Comptez les inscriptions", "Comparez avec la moitié de la capacité", "Joignez avec events"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Trouver les participants inscrits à l'événement ayant la plus grande capacité.",
            expectedQuery: "db.events.aggregate([{$sort: {capacity: -1}}, {$limit: 1}, {$lookup: {from: 'registrations', localField: 'eventId', foreignField: 'eventId', as: 'regs'}}, {$unwind: '$regs'}, {$lookup: {from: 'attendees', localField: 'regs.attendeeId', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$project: {name: '$attendee.name'}}])",
            hints: ["Trouvez l'événement avec la plus grande capacité", "Joignez avec registrations et attendees"],
            points: 25
        },
        {
            difficulty: "moyen",
            question: "Lister les événements triés par date décroissante.",
            expectedQuery: "db.events.find().sort({ date: -1 })",
            hints: ["Utilisez sort avec -1", "Collection events"],
            points: 15
        },
        {
            difficulty: "moyen",
            question: "Trouver les participants inscrits à des événements à Paris ou Lyon.",
            expectedQuery: "db.registrations.aggregate([{$lookup: {from: 'events', localField: 'eventId', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$match: {'event.location': {$in: ['Paris', 'Lyon']}}}, {$lookup: {from: 'attendees', localField: 'attendeeId', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$project: {name: '$attendee.name'}}])",
            hints: ["Utilisez $in pour les lieux", "Joignez avec events et attendees"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Lister les événements avec leur nombre d'inscriptions et leur capacité.",
            expectedQuery: "db.events.aggregate([{$lookup: {from: 'registrations', localField: 'eventId', foreignField: 'eventId', as: 'regs'}}, {$project: {title: 1, capacity: 1, totalRegistrations: {$size: '$regs'}}}, {$sort: {title: 1}}])",
            hints: ["Joignez avec registrations", "Utilisez $size pour compter"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Trouver les participants ayant le même nom qu'un autre participant.",
            expectedQuery: "db.attendees.aggregate([{$group: {_id: '$name', count: {$sum: 1}}}, {$match: {count: {$gt: 1}}}, {$lookup: {from: 'attendees', localField: '_id', foreignField: 'name', as: 'attendees'}}, {$unwind: '$attendees'}, {$project: {name: '$attendees.name', email: '$attendees.email'}}])",
            hints: ["Groupez par nom", "Filtrez les doublons", "Joignez avec attendees"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Lister les événements ayant des inscriptions mais pas à pleine capacité.",
            expectedQuery: "db.registrations.aggregate([{$group: {_id: '$eventId', total: {$sum: 1}}}, {$lookup: {from: 'events', localField: '_id', foreignField: 'eventId', as: 'event'}}, {$unwind: '$event'}, {$match: {$expr: {$lt: ['$total', '$event.capacity']}}}, {$project: {title: '$event.title'}}])",
            hints: ["Comptez les inscriptions", "Comparez avec la capacité", "Joinez avec events"],
            points: 20
        },
        {
            difficulty: "moyen",
            question: "Trouver le nombre total d'inscriptions par participant, trié par ordre décroissant.",
            expectedQuery: "db.registrations.aggregate([{$group: {_id: '$attendeeId', total: {$sum: 1}}}, {$lookup: {from: 'attendees', localField: '_id', foreignField: 'attendeeId', as: 'attendee'}}, {$unwind: '$attendee'}, {$project: {name: '$attendee.name', total: 1}}, {$sort: {total: -1}}])",
            hints: ["Groupez par attendeeId", "Joignez avec attendees", "Triez par total"],
            points: 20
        }
    ]
};