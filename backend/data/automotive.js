module.exports = {
    name: "automotive",
    description: "Gestion d'une salle de sport",
    collections: {
        classes: [
            {
                classId: "CL001",
                name: "Yoga Matinal",
                date: "2025-06-01",
                time: "08:00",
                capacity: 20,
                instructor: "Anna Smith"
            },
            {
                classId: "CL002",
                name: "Zumba Énergique",
                date: "2025-06-02",
                time: "18:00",
                capacity: 15,
                instructor: "Mark Jones"
            },
            {
                classId: "CL003",
                name: "Pilates Avancé",
                date: "2025-06-03",
                time: "10:00",
                capacity: 12,
                instructor: "Anna Smith"
            },
            {
                classId: "CL004",
                name: "Cardio Blast",
                date: "2025-06-04",
                time: "17:00",
                capacity: 25,
                instructor: "Laura Brown"
            },
            {
                classId: "CL005",
                name: "Stretching",
                date: "2025-06-05",
                time: "09:00",
                capacity: 18,
                instructor: "Mark Jones"
            }
        ],
        members: [
            {memberId: "MB001", name: "Sophie Lefèvre", email: "sophie.lefevre@example.com", membershipType: "Premium"},
            {memberId: "MB002", name: "Lucas Dubois", email: "lucas.dubois@example.com", membershipType: "Standard"},
            {memberId: "MB003", name: "Marie Claire", email: "marie.claire@example.com", membershipType: "Basic"},
            {memberId: "MB004", name: "Paul Martin", email: "paul.martin@example.com", membershipType: "Premium"},
            {memberId: "MB005", name: "Emma Durand", email: "emma.durand@example.com", membershipType: "Standard"}
        ],
        bookings: [
            {classId: "CL001", memberId: "MB001", bookingDate: "2025-05-20"},
            {classId: "CL002", memberId: "MB002", bookingDate: "2025-05-21"},
            {classId: "CL003", memberId: "MB003", bookingDate: "2025-05-22"},
            {classId: "CL004", memberId: "MB004", bookingDate: "2025-05-23"},
            {classId: "CL005", memberId: "MB005", bookingDate: "2025-05-24"}
        ]
    },
    questions: [
        {
            difficulty: "facile",
            question: "Lister tous les cours de la salle de sport.",
            expectedQuery: "db.classes.find({})",
            hints: ["Utilisez la collection classes", "Aucun filtre nécessaire"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver tous les membres ayant un abonnement 'Premium'.",
            expectedQuery: "db.members.find({ membershipType: 'Premium' })",
            hints: ["Filtrez sur membershipType", "Collection members"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les cours ayant lieu le 2025-06-01.",
            expectedQuery: "db.classes.find({ date: '2025-06-01' })",
            hints: ["Filtrez sur le champ date", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver les membres ayant un email contenant 'example.com'.",
            expectedQuery: "db.members.find({ email: {$regex: 'example.com', $options: 'i'} })",
            hints: ["Utilisez $regex pour l'email", "Ignorez la casse"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les cours avec une capacité supérieure à 15.",
            expectedQuery: "db.classes.find({ capacity: {$gt: 15} })",
            hints: ["Utilisez $gt pour la capacité", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver les réservations effectuées le 2025-05-20.",
            expectedQuery: "db.bookings.find({ bookingDate: '2025-05-20' })",
            hints: ["Filtrez sur bookingDate", "Collection bookings"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les cours dirigés par 'Anna Smith'.",
            expectedQuery: "db.classes.find({ instructor: 'Anna Smith' })",
            hints: ["Filtrez sur instructor", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver les membres ayant réservé le cours 'Zumba Énergique'.",
            expectedQuery: "db.bookings.aggregate([{$match: {classId: 'CL002'}}, {$lookup: {from: 'members', localField: 'memberId', foreignField: 'memberId', as: 'member'}}, {$unwind: '$member'}, {$project: {name: '$member.name'}}])",
            hints: ["Filtrez par classId", "Joignez avec members", "Projetez le nom"],
            points: 15
        },
        {
            difficulty: "facile",
            question: "Lister les cours ayant lieu à 08:00.",
            expectedQuery: "db.classes.find({ time: '08:00' })",
            hints: ["Filtrez sur le champ time", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver les réservations pour le cours 'Pilates Avancé'.",
            expectedQuery: "db.bookings.find({ classId: 'CL003' })",
            hints: ["Filtrez par classId", "Collection bookings"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les noms des membres ayant réservé un cours.",
            expectedQuery: "db.bookings.aggregate([{$lookup: {from: 'members', localField: 'memberId', foreignField: 'memberId', as: 'member'}}, {$unwind: '$member'}, {$project: {name: '$member.name'}}])",
            hints: ["Joignez bookings et members", "Projetez le nom"],
            points: 15
        },
        {
            difficulty: "facile",
            question: "Trouver les cours avec une capacité de 12.",
            expectedQuery: "db.classes.find({ capacity: 12 })",
            hints: ["Filtrez par capacité exacte", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les réservations effectuées avant le 2025-05-22.",
            expectedQuery: "db.bookings.find({ bookingDate: {$lt: '2025-05-22'} })",
            hints: ["Utilisez $lt pour la date", "Collection bookings"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver les membres dont le nom commence par 'M'.",
            expectedQuery: "db.members.find({ name: {$regex: '^M', $options: 'i'} })",
            hints: ["Utilisez $regex pour le début du nom", "Ignorez la casse"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les cours ayant lieu en juin 2025.",
            expectedQuery: "db.classes.find({ date: {$regex: '^2025-06'} })",
            hints: ["Utilisez $regex pour le mois", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver le nombre total de réservations pour chaque cours.",
            expectedQuery: "db.bookings.aggregate([{$group: {_id: '$classId', totalBookings: {$sum: 1}}}, {$sort: {_id: 1}}])",
            hints: ["Groupez par classId", "Utilisez $sum pour compter"],
            points: 15
        },
        {
            difficulty: "facile",
            question: "Lister les emails des membres ayant réservé un cours.",
            expectedQuery: "db.bookings.aggregate([{$lookup: {from: 'members', localField: 'memberId', foreignField: 'memberId', as: 'member'}}, {$unwind: '$member'}, {$project: {email: '$member.email'}}])",
            hints: ["Joignez bookings et members", "Projetez l'email"],
            points: 15
        },
        {
            difficulty: "facile",
            question: "Trouver les cours ayant plus de 20 places de capacité.",
            expectedQuery: "db.classes.find({ capacity: {$gt: 20} })",
            hints: ["Utilisez $gt pour la capacité", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les réservations pour les cours ayant lieu à 17:00.",
            expectedQuery: "db.bookings.aggregate([{$lookup: {from: 'classes', localField: 'classId', foreignField: 'classId', as: 'class'}}, {$unwind: '$class'}, {$match: {'class.time': '17:00'}}, {$project: {classId: 1, memberId: 1}}])",
            hints: ["Joignez avec classes", "Filtrez par heure"],
            points: 15
        },
        {
            difficulty: "facile",
            question: "Trouver les membres ayant le nom 'Paul Martin'.",
            expectedQuery: "db.members.find({ name: 'Paul Martin' })",
            hints: ["Filtrez par nom exact", "Collection members"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les cours triés par date croissante.",
            expectedQuery: "db.classes.find().sort({ date: 1 })",
            hints: ["Utilisez sort avec 1", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver les réservations effectuées par 'Marie Claire'.",
            expectedQuery: "db.bookings.aggregate([{$lookup: {from: 'members', localField: 'memberId', foreignField: 'memberId', as: 'member'}}, {$unwind: '$member'}, {$match: {'member.name': 'Marie Claire'}}, {$project: {classId: 1, bookingDate: 1}}])",
            hints: ["Joignez avec members", "Filtrez par nom"],
            points: 15
        },
        {
            difficulty: "facile",
            question: "Lister les noms des cours réservés par des membres 'Premium'.",
            expectedQuery: "db.bookings.aggregate([{$lookup: {from: 'members', localField: 'memberId', foreignField: 'memberId', as: 'member'}}, {$unwind: '$member'}, {$match: {'member.membershipType': 'Premium'}}, {$lookup: {from: 'classes', localField: 'classId', foreignField: 'classId', as: 'class'}}, {$unwind: '$class'}, {$project: {name: '$class.name'}}])",
            hints: ["Joinez avec members et classes", "Filtrez par type d'abonnement"],
            points: 15
        },
        {
            difficulty: "facile",
            question: "Trouver les membres ayant un abonnement 'Standard'.",
            expectedQuery: "db.members.find({ membershipType: 'Standard' })",
            hints: ["Filtrez sur membershipType", "Collection members"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les cours ayant une capacité inférieure ou égale à 15.",
            expectedQuery: "db.classes.find({ capacity: {$lte: 15} })",
            hints: ["Utilisez $lte pour la capacité", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver les réservations pour les cours ayant lieu en 2025.",
            expectedQuery: "db.bookings.aggregate([{$lookup: {from: 'classes', localField: 'classId', foreignField: 'classId', as: 'class'}}, {$unwind: '$class'}, {$match: {'class.date': {$regex: '^2025'}}}, {$project: {classId: 1, memberId: 1}}])",
            hints: ["Joinez avec classes", "Filtrez par année"],
            points: 15
        },
        {
            difficulty: "facile",
            question: "Lister les noms des membres triés par ordre alphabétique.",
            expectedQuery: "db.members.find().sort({ name: 1 })",
            hints: ["Utilisez sort avec 1", "Collection members"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver les cours ayant exactement 18 places de capacité.",
            expectedQuery: "db.classes.find({ capacity: 18 })",
            hints: ["Filtrez par capacité exacte", "Collection classes"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Lister les réservations triées par date de réservation croissante.",
            expectedQuery: "db.bookings.find().sort({ bookingDate: 1 })",
            hints: ["Utilisez sort avec 1", "Collection bookings"],
            points: 10
        },
        {
            difficulty: "facile",
            question: "Trouver les noms des cours réservés par 'Emma Durand'.",
            expectedQuery: "db.bookings.aggregate([{$lookup: {from: 'members', localField: 'memberId', foreignField: 'memberId', as: 'member'}}, {$unwind: '$member'}, {$match: {'member.name': 'Emma Durand'}}, {$lookup: {from: 'classes', localField: 'classId', foreignField: 'classId', as: 'class'}}, {$unwind: '$class'}, {$project: {name: '$class.name'}}])",
            hints: ["Joinez avec members et classes", "Filtrez par nom"],
            points: 15
        }
    ]
};