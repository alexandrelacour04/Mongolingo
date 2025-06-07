module.exports = {
    name: "library",
    description: "Gestion de bibliothèque universitaire",
    collections: {
        books: [
            {
                title: "Introduction à MongoDB",
                author: "John Doe",
                isbn: "123-456-789",
                available: true,
                category: "Informatique"
            },
            {
                title: "Les Bases de Données NoSQL",
                author: "Jane Smith",
                isbn: "987-654-321",
                available: false,
                category: "Informatique"
            },
            {
                title: "Algèbre Linéaire",
                author: "Alan Turing",
                isbn: "111-222-333",
                available: true,
                category: "Mathématiques"
            },
            {
                title: "Philosophie Moderne",
                author: "Emma Brown",
                isbn: "444-555-666",
                available: true,
                category: "Philosophie"
            },
            {
                title: "Programmation Python",
                author: "John Doe",
                isbn: "777-888-999",
                available: false,
                category: "Informatique"
            }
        ],
        students: [
            {studentId: "ST001", name: "Marie Dupont", department: "Informatique", yearOfStudy: 2},
            {studentId: "ST002", name: "Pierre Martin", department: "Mathématiques", yearOfStudy: 3},
            {studentId: "ST003", name: "Claire Dubois", department: "Philosophie", yearOfStudy: 1},
            {studentId: "ST004", name: "Luc Durand", department: "Informatique", yearOfStudy: 4},
            {studentId: "ST005", name: "Sophie Lefèvre", department: "Mathématiques", yearOfStudy: 2}
        ],
        loans: [
            {bookId: "123-456-789", studentId: "ST001", loanDate: "2024-01-01", returnDate: "2024-01-15"},
            {bookId: "987-654-321", studentId: "ST002", loanDate: "2024-02-01", returnDate: null},
            {bookId: "111-222-333", studentId: "ST003", loanDate: "2024-03-01", returnDate: "2024-03-20"},
            {bookId: "444-555-666", studentId: "ST004", loanDate: "2024-04-01", returnDate: null},
            {bookId: "777-888-999", studentId: "ST005", loanDate: "2024-05-01", returnDate: "2024-05-10"}
        ]
    },
    questions: [
        {
            difficulty: "difficile",
            question: "Trouver le nombre total de livres empruntés par chaque étudiant, incluant ceux qui n'ont jamais emprunté, avec leur département et année d'étude.",
            expectedQuery: "db.students.aggregate([{$lookup: {from: 'loans', localField: 'studentId', foreignField: 'studentId', as: 'loans'}}, {$project: {name: 1, department: 1, yearOfStudy: 1, totalLoans: {$size: '$loans'}}}, {$sort: {name: 1}}])",
            hints: ["Utilisez $lookup pour joindre students et loans", "Comptez les emprunts avec $size", "Incluez tous les étudiants"],
            points: 30
        },
        {
            difficulty: "difficile",
            question: "Lister les livres de la catégorie 'Informatique' qui n'ont jamais été empruntés.",
            expectedQuery: "db.books.aggregate([{$match: {category: 'Informatique'}}, {$lookup: {from: 'loans', localField: 'isbn', foreignField: 'bookId', as: 'loans'}}, {$match: {loans: {$size: 0}}}, {$project: {title: 1, author: 1}}])",
            hints: ["Filtrez par catégorie", "Joignez avec loans", "Vérifiez les livres sans emprunts"],
            points: 25
        },
        {
            difficulty: "difficile",
            question: "Trouver les étudiants ayant emprunté au moins un livre dans chaque catégorie disponible.",
            expectedQuery: "db.students.aggregate([{$lookup: {from: 'loans', localField: 'studentId', foreignField: 'studentId', as: 'loans'}}, {$lookup: {from: 'books', localField: 'loans.bookId', foreignField: 'isbn', as: 'books'}}, {$group: {_id: '$studentId', name: {$first: '$name'}, categories: {$addToSet: '$books.category'}}}, {$lookup: {from: 'books', pipeline: [{$group: {_id: '$category'}}], as: 'allCategories'}}, {$match: {$expr: {$setEquals: ['$categories', '$allCategories._id']}}}, {$project: {name: 1}}])",
            hints: ["Joignez students, loans et books", "Collectez les catégories", "Comparez avec $setEquals"],
            points: 45
        },
        {
            difficulty: "difficile",
            question: "Calculer la durée moyenne des emprunts par catégorie de livre, pour les emprunts terminés.",
            expectedQuery: "db.loans.aggregate([{$match: {returnDate: {$exists: true}}}, {$lookup: {from: 'books', localField: 'bookId', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$project: {category: '$book.category', duration: {$divide: [{$subtract: [{$dateFromString: {dateString: '$returnDate'}}, {$dateFromString: {dateString: '$loanDate'}}]}, 86400000]}}}, {$group: {_id: '$category', avgDuration: {$avg: '$duration'}}}, {$sort: {_id: 1}}])",
            hints: ["Filtrez les emprunts terminés", "Calculez la durée", "Groupez par catégorie"],
            points: 40
        },
        {
            difficulty: "difficile",
            question: "Lister les étudiants ayant emprunté des livres dans au moins deux départements différents.",
            expectedQuery: "db.loans.aggregate([{$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$group: {_id: '$studentId', name: {$first: '$student.name'}, departments: {$addToSet: '$student.department'}}}, {$match: {$expr: {$gte: [{$size: '$departments'}, 2]}}}, {$project: {name: 1}}])",
            hints: ["Joignez avec students", "Collectez les départements", "Filtrez par taille"],
            points: 35
        },
        {
            difficulty: "difficile",
            question: "Trouver le livre le plus emprunté dans la catégorie 'Mathématiques'.",
            expectedQuery: "db.loans.aggregate([{$lookup: {from: 'books', localField: 'bookId', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$match: {'book.category': 'Mathématiques'}}, {$group: {_id: '$bookId', title: {$first: '$book.title'}, count: {$sum: 1}}}, {$sort: {count: -1}}, {$limit: 1}, {$project: {title: 1, count: 1}}])",
            hints: ["Joignez avec books", "Filtrez par catégorie", "Triez par nombre d'emprunts"],
            points: 30
        },
        {
            difficulty: "difficile",
            question: "Lister les étudiants en 2e année ayant des emprunts en retard (returnDate null).",
            expectedQuery: "db.loans.aggregate([{$match: {returnDate: {$exists: false}}}, {$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$match: {'student.yearOfStudy': 2}}, {$project: {name: '$student.name'}}])",
            hints: ["Filtrez les emprunts non retournés", "Joignez avec students", "Filtrez par année"],
            points: 30
        },
        {
            difficulty: "difficile",
            question: "Trouver les livres empruntés par des étudiants de plusieurs années d'étude différentes.",
            expectedQuery: "db.loans.aggregate([{$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$group: {_id: '$bookId', years: {$addToSet: '$student.yearOfStudy'}}}, {$match: {$expr: {$gt: [{$size: '$years'}, 1]}}}, {$lookup: {from: 'books', localField: '_id', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$project: {title: '$book.title'}}])",
            hints: ["Joignez avec students", "Collectez les années d'étude", "Filtrez par taille"],
            points: 35
        },
        {
            difficulty: "difficile",
            question: "Calculer le nombre total de jours d'emprunt par étudiant, pour les emprunts terminés.",
            expectedQuery: "db.loans.aggregate([{$match: {returnDate: {$exists: true}}}, {$project: {studentId: 1, duration: {$divide: [{$subtract: [{$dateFromString: {dateString: '$returnDate'}}, {$dateFromString: {dateString: '$loanDate'}}]}, 86400000]}}}, {$group: {_id: '$studentId', totalDays: {$sum: '$duration'}}}, {$lookup: {from: 'students', localField: '_id', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$project: {name: '$student.name', totalDays: 1}}])",
            hints: ["Calculez la durée des emprunts", "Groupez par étudiant", "Joignez avec students"],
            points: 40
        },
        {
            difficulty: "difficile",
            question: "Lister les livres ayant été empruntés consécutivement par le même étudiant.",
            expectedQuery: "db.loans.aggregate([{$sort: {bookId: 1, loanDate: 1}}, {$group: {_id: '$bookId', loans: {$push: {studentId: '$studentId', loanDate: '$loanDate'}}}}, {$match: {$expr: {$gt: [{$size: '$loans'}, 1]}}}, {$unwind: '$loans'}, {$lookup: {from: 'books', localField: '_id', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$group: {_id: {bookId: '$_id', title: '$book.title'}, students: {$push: '$loans.studentId'}}}, {$match: {$expr: {$gt: [{$size: {$setIntersection: ['$students', '$students']}}, 1]}}}, {$project: {title: '$_id.title'}}])",
            hints: ["Triez par livre et date", "Vérifiez les emprunts consécutifs", "Joignez avec books"],
            points: 40
        },
        {
            difficulty: "difficile",
            question: "Trouver les étudiants ayant emprunté tous les livres d'un auteur spécifique (par exemple, 'John Doe').",
            expectedQuery: "db.students.aggregate([{$lookup: {from: 'loans', localField: 'studentId', foreignField: 'studentId', as: 'loans'}}, {$lookup: {from: 'books', localField: 'loans.bookId', foreignField: 'isbn', as: 'books'}}, {$match: {'books.author': 'John Doe'}}, {$group: {_id: '$studentId', name: {$first: '$name'}, books: {$addToSet: '$books.isbn'}}}, {$lookup: {from: 'books', pipeline: [{$match: {author: 'John Doe'}}], as: 'authorBooks'}}, {$match: {$expr: {$setEquals: ['$books', '$authorBooks.isbn']}}}, {$project: {name: 1}}])",
            hints: ["Joignez students, loans et books", "Filtrez par auteur", "Comparez avec $setEquals"],
            points: 45
        },
        {
            difficulty: "difficile",
            question: "Lister les départements ayant au moins un étudiant ayant emprunté un livre de chaque catégorie.",
            expectedQuery: "db.students.aggregate([{$lookup: {from: 'loans', localField: 'studentId', foreignField: 'studentId', as: 'loans'}}, {$lookup: {from: 'books', localField: 'loans.bookId', foreignField: 'isbn', as: 'books'}}, {$group: {_id: {studentId: '$studentId', department: '$department'}, categories: {$addToSet: '$books.category'}}}, {$lookup: {from: 'books', pipeline: [{$group: {_id: '$category'}}], as: 'allCategories'}}, {$match: {$expr: {$setEquals: ['$categories', '$allCategories._id']}}}, {$group: {_id: '$_id.department'}}, {$project: {department: '$_id'}}])",
            hints: ["Joignez students, loans et books", "Collectez les catégories par étudiant", "Groupez par département"],
            points: 45
        },
        {
            difficulty: "difficile",
            question: "Trouver les livres ayant été empruntés plus longtemps que la moyenne des durées d'emprunt dans leur catégorie.",
            expectedQuery: "db.loans.aggregate([{$match: {returnDate: {$exists: true}}}, {$lookup: {from: 'books', localField: 'bookId', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$project: {bookId: 1, title: '$book.title', category: '$book.category', duration: {$divide: [{$subtract: [{$dateFromString: {dateString: '$returnDate'}}, {$dateFromString: {dateString: '$loanDate'}}]}, 86400000]}}}, {$group: {_id: '$category', avgDuration: {$avg: '$duration'}, loans: {$push: {bookId: '$bookId', title: '$title', duration: '$duration'}}}}, {$unwind: '$loans'}, {$match: {$expr: {$gt: ['$loans.duration', '$avgDuration']}}}, {$project: {title: '$loans.title'}}])",
            hints: ["Calculez la durée moyenne par catégorie", "Comparez chaque durée", "Joignez avec books"],
            points: 45
        },
        {
            difficulty: "difficile",
            question: "Lister les étudiants ayant emprunté des livres dans un ordre spécifique de catégories (par exemple, Informatique puis Mathématiques).",
            expectedQuery: "db.loans.aggregate([{$lookup: {from: 'books', localField: 'bookId', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$sort: {studentId: 1, loanDate: 1}}, {$group: {_id: '$studentId', categories: {$push: '$book.category'}}}, {$match: {$expr: {$and: [{$in: ['Informatique', '$categories']}, {$in: ['Mathématiques', '$categories']}, {$gt: [{$indexOfArray: ['$categories', 'Mathématiques']}, {$indexOfArray: ['$categories', 'Informatique']}]}}}, {$lookup: {from: 'students', localField: '_id', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$project: {name: '$student.name'}}])",
            hints: ["Triez par étudiant et date", "Vérifiez l'ordre des catégories", "Utilisez $indexOfArray"],
            points: 40
        },
        {
            difficulty: "difficile",
            question: "Trouver les livres ayant été empruntés par des étudiants ayant le même nombre total d'emprunts.",
            expectedQuery: "db.loans.aggregate([{$group: {_id: '$studentId', totalLoans: {$sum: 1}}}, {$group: {_id: '$totalLoans', students: {$addToSet: '$_id'}}}, {$match: {$expr: {$gt: [{$size: '$students'}, 1]}}}, {$lookup: {from: 'loans', localField: 'students', foreignField: 'studentId', as: 'loans'}}, {$unwind: '$loans'}, {$lookup: {from: 'books', localField: 'loans.bookId', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$group: {_id: '$book.isbn', title: {$first: '$book.title'}}}, {$project: {title: 1}}])",
            hints: ["Groupez par nombre d'emprunts", "Joignez avec loans et books", "Filtrez les étudiants avec même nombre d'emprunts"],
            points: 40
        },
        {
            difficulty: "difficile",
            question: "Lister les étudiants ayant emprunté des livres uniquement dans leur propre département.",
            expectedQuery: "db.loans.aggregate([{$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$lookup: {from: 'books', localField: 'bookId', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$group: {_id: '$studentId', name: {$first: '$student.name'}, department: {$first: '$student.department'}, bookCategories: {$addToSet: '$book.category'}}}, {$match: {$expr: {$eq: ['$bookCategories', ['$department']]}}}, {$project: {name: 1, department: 1}}])",
            hints: ["Joignez students, loans et books", "Comparez catégories et département", "Utilisez $addToSet"],
            points: 35
        },
        {
            difficulty: "difficile",
            question: "Trouver les livres ayant été empruntés par des étudiants ayant des noms commençant par la même lettre.",
            expectedQuery: "db.loans.aggregate([{$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$addFields: {firstLetter: {$toUpper: {$substr: ['$student.name', 0, 1]}}}}, {$group: {_id: '$bookId', letters: {$addToSet: '$firstLetter'}}}, {$match: {$expr: {$eq: [{$size: '$letters'}, 1]}}}, {$lookup: {from: 'books', localField: '_id', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$project: {title: '$book.title'}}])",
            hints: ["Extrayez la première lettre", "Groupez par livre", "Vérifiez une seule lettre"],
            points: 40
        },
        {
            difficulty: "difficile",
            question: "Lister les étudiants ayant emprunté des livres dans plusieurs années différentes.",
            expectedQuery: "db.loans.aggregate([{$addFields: {year: {$year: {$dateFromString: {dateString: '$loanDate'}}}}}, {$group: {_id: '$studentId', years: {$addToSet: '$year'}}}, {$match: {$expr: {$gt: [{$size: '$years'}, 1]}}}, {$lookup: {from: 'students', localField: '_id', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$project: {name: '$student.name'}}])",
            hints: ["Extrayez l'année", "Groupez par étudiant", "Filtrez par taille"],
            points: 35
        },
        {
            difficulty: "difficile",
            question: "Trouver le département avec le plus grand nombre d'emprunts en 2024.",
            expectedQuery: "db.loans.aggregate([{$match: {loanDate: {$regex: '^2024'}}}, {$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$group: {_id: '$student.department', totalLoans: {$sum: 1}}}, {$sort: {totalLoans: -1}}, {$limit: 1}])",
            hints: ["Filtrez par année", "Joinez avec students", "Triez par total"],
            points: 30
        },
        {
            difficulty: "difficile",
            question: "Lister les livres ayant une durée d'emprunt maximale supérieure à 15 jours.",
            expectedQuery: "db.loans.aggregate([{$match: {returnDate: {$exists: true}}}, {$project: {bookId: 1, duration: {$divide: [{$subtract: [{$dateFromString: {dateString: '$returnDate'}}, {$dateFromString: {dateString: '$loanDate'}}]}, 86400000]}}}, {$group: {_id: '$bookId', maxDuration: {$max: '$duration'}}}, {$match: {maxDuration: {$gt: 15}}}, {$lookup: {from: 'books', localField: '_id', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$project: {title: '$book.title'}}])",
            hints: ["Calculez la durée", "Trouvez la durée maximale", "Filtrez par durée"],
            points: 35
        },
        {
            difficulty: "difficile",
            question: "Trouver les étudiants ayant emprunté plus de livres que la moyenne par étudiant.",
            expectedQuery: "db.loans.aggregate([{$group: {_id: '$studentId', totalLoans: {$sum: 1}}}, {$group: {_id: null, avgLoans: {$avg: '$totalLoans'}, students: {$push: {studentId: '$_id', totalLoans: '$totalLoans'}}}}, {$unwind: '$students'}, {$match: {$expr: {$gt: ['$students.totalLoans', '$avgLoans']}}}, {$lookup: {from: 'students', localField: 'students.studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$project: {name: '$student.name'}}])",
            hints: ["Calculez la moyenne des emprunts", "Comparez chaque étudiant", "Joignez avec students"],
            points: 40
        },
        {
            difficulty: "difficile",
            question: "Lister les livres empruntés par des étudiants de tous les départements sauf un.",
            expectedQuery: "db.loans.aggregate([{$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$group: {_id: '$bookId', departments: {$addToSet: '$student.department'}}}, {$lookup: {from: 'students', pipeline: [{$group: {_id: '$department'}}], as: 'allDepartments'}}, {$match: {$expr: {$and: [{$ne: [{$size: '$departments'}, {$size: '$allDepartments'}]}, {$eq: [{$size: {$setDifference: ['$allDepartments._id', '$departments']}}, 1]]}}}, {$lookup: {from: 'books', localField: '_id', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$project: {title: '$book.title'}}])",
            hints: ["Groupez par livre et départements", "Utilisez $setDifference", "Joignez avec books"],
            points: 45
        },
        {
            difficulty: "difficile",
            question: "Trouver les étudiants ayant emprunté des livres dans plus d'une catégorie, triés par nombre de catégories.",
            expectedQuery: "db.loans.aggregate([{$lookup: {from: 'books', localField: 'bookId', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$group: {_id: '$studentId', categories: {$addToSet: '$book.category'}}}, {$project: {studentId: '$_id', categoryCount: {$size: '$categories'}}}, {$match: {categoryCount: {$gt: 1}}}, {$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$project: {name: '$student.name', categoryCount: 1}}, {$sort: {categoryCount: -1}}])",
            hints: ["Collectez les catégories par étudiant", "Comptez les catégories", "Triez par nombre"],
            points: 35
        },
        {
            difficulty: "difficile",
            question: "Lister les livres ayant été empruntés dans un intervalle de dates spécifique (2024-01-01 à 2024-03-31).",
            expectedQuery: "db.loans.aggregate([{$match: {loanDate: {$gte: '2024-01-01', $lte: '2024-03-31'}}}, {$lookup: {from: 'books', localField: 'bookId', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$project: {title: '$book.title'}}])",
            hints: ["Filtrez par intervalle de dates", "Joignez avec books", "Projetez le titre"],
            points: 30
        },
        {
            difficulty: "difficile",
            question: "Trouver les étudiants ayant emprunté le même livre plusieurs fois dans la même année.",
            expectedQuery: "db.loans.aggregate([{$addFields: {year: {$year: {$dateFromString: {dateString: '$loanDate'}}}}}, {$group: {_id: {studentId: '$studentId', bookId: '$bookId', year: '$year'}, count: {$sum: 1}}}, {$match: {count: {$gt: 1}}}, {$lookup: {from: 'students', localField: '_id.studentId', foreignField: 'studentId', as: 'student'}}, {$lookup: {from: 'books', localField: '_id.bookId', foreignField: 'isbn', as: 'book'}}, {$unwind: '$student'}, {$unwind: '$book'}, {$project: {name: '$student.name', bookTitle: '$book.title', year: '$_id.year'}}])",
            hints: ["Extrayez l'année", "Groupez par étudiant, livre et année", "Filtrez les multiples emprunts"],
            points: 35
        },
        {
            difficulty: "difficile",
            question: "Lister les étudiants ayant emprunté des livres de tous les auteurs sauf un.",
            expectedQuery: "db.students.aggregate([{$lookup: {from: 'loans', localField: 'studentId', foreignField: 'studentId', as: 'loans'}}, {$lookup: {from: 'books', localField: 'loans.bookId', foreignField: 'isbn', as: 'books'}}, {$group: {_id: '$studentId', name: {$first: '$name'}, authors: {$addToSet: '$books.author'}}}, {$lookup: {from: 'books', pipeline: [{$group: {_id: '$author'}}], as: 'allAuthors'}}, {$match: {$expr: {$and: [{$ne: [{$size: '$authors'}, {$size: '$allAuthors'}]}, {$eq: [{$size: {$setDifference: ['$allAuthors._id', '$authors']}}, 1]]}}}, {$project: {name: 1}}])",
            hints: ["Collectez les auteurs par étudiant", "Comparez avec tous les auteurs", "Utilisez $setDifference"],
            points: 45
        },
        {
            difficulty: "difficile",
            question: "Trouver les livres ayant été empruntés par des étudiants ayant des emprunts dans plusieurs départements.",
            expectedQuery: "db.loans.aggregate([{$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$group: {_id: '$studentId', departments: {$addToSet: '$student.department'}, books: {$addToSet: '$bookId'}}}, {$match: {$expr: {$gt: [{$size: '$departments'}, 1]}}}, {$unwind: '$books'}, {$lookup: {from: 'books', localField: 'books', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$project: {title: '$book.title'}}])",
            hints: ["Groupez par étudiant et départements", "Filtrez les étudiants multi-départements", "Joignez avec books"],
            points: 40
        },
        {
            difficulty: "difficile",
            question: "Lister les étudiants ayant emprunté des livres dans un mois spécifique (par exemple, janvier 2024).",
            expectedQuery: "db.loans.aggregate([{$match: {loanDate: {$regex: '^2024-01'}}}, {$lookup: {from: 'students', localField: 'studentId', foreignField: 'studentId', as: 'student'}}, {$unwind: '$student'}, {$group: {_id: '$studentId', name: {$first: '$student.name'}}}, {$project: {name: 1}}])",
            hints: ["Filtrez par mois avec $regex", "Joignez avec students", "Évitez les doublons"],
            points: 30
        },
        {
            difficulty: "difficile",
            question: "Trouver les livres ayant une durée d'emprunt moyenne supérieure à 10 jours.",
            expectedQuery: "db.loans.aggregate([{$match: {returnDate: {$exists: true}}}, {$project: {bookId: 1, duration: {$divide: [{$subtract: [{$dateFromString: {dateString: '$returnDate'}}, {$dateFromString: {dateString: '$loanDate'}}]}, 86400000]}}}, {$group: {_id: '$bookId', avgDuration: {$avg: '$duration'}}}, {$match: {avgDuration: {$gt: 10}}}, {$lookup: {from: 'books', localField: '_id', foreignField: 'isbn', as: 'book'}}, {$unwind: '$book'}, {$project: {title: '$book.title'}}])",
            hints: ["Calculez la durée moyenne", "Filtrez par durée", "Joignez avec books"],
            points: 35
        }
    ]
};