const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("../models/Question");

dotenv.config();

const questions = [
  {
    question: "Dopo una giornata tipo, come ti senti quando pensi di uscire?",
    order: 1,
    category: "Energia",
    options: [
      { text: "Ho ancora voglia di fare cose", personality: "B", points: 2 },
      { text: "Sto bene, ma senza esagerare", personality: "D", points: 2 },
      {
        text: "Preferisco qualcosa di tranquillo",
        personality: "A",
        points: 2,
      },
      { text: "Dipende dal momento", personality: "C", points: 2 },
    ],
  },

  {
    question: "Quando esci, con chi ti piacerebbe stare?",
    order: 2,
    category: "Socialità",
    options: [
      { text: "...stare con più persone", personality: "D", points: 2 },
      { text: "...condividere con una persona", personality: "G", points: 2 },
      { text: "...fare qualcosa per conto mio", personality: "C", points: 2 },
      { text: "...non ho preferenze", personality: "A", points: 2 },
    ],
  },

  {
    question: "Quanto cerchi novità quando esci?",
    order: 3,
    category: "Novità",
    options: [
      { text: "Molto / massimo", personality: "E", points: 2 },
      { text: "Mi piace alternare", personality: "D", points: 2 },
      { text: "Meglio restare sul sicuro", personality: "A", points: 2 },
      { text: "Dipende", personality: "C", points: 2 },
    ],
  },

  {
    question: "Dove ti piacerebbe stare di più?",
    order: 4,
    category: "Ambiente",
    options: [
      { text: "In città", personality: "E", points: 2 },
      { text: "All'aperto / fuori città", personality: "F", points: 2 },
      { text: "Tranquillo e raccolto", personality: "A", points: 2 },
      { text: "Deve succedere qualcosa", personality: "B", points: 2 },
    ],
  },

  {
    question: "Quando sei in gruppo, come ti comporti?",
    order: 5,
    category: "Gruppo",
    options: [
      { text: "Tendo a guidare il gruppo", personality: "B", points: 2 },
      {
        text: "Preferisco che decidano gli altri",
        personality: "D",
        points: 2,
      },
      { text: "Mi va bene discutere", personality: "C", points: 2 },
      { text: "Basta che succeda qualcosa", personality: "E", points: 2 },
    ],
  },

  {
    question: "Cosa cerchi davvero quando esci?",
    order: 6,
    category: "Identità",
    options: [
      { text: "Se esco, devo farmi stare meglio", personality: "A", points: 2 },
      { text: "Se esco, voglio sentirmi vivo", personality: "B", points: 2 },
      {
        text: "Mi piace scegliere da solo cosa fare",
        personality: "C",
        points: 2,
      },
      { text: "Conto con chi sono", personality: "D", points: 2 },
      {
        text: "Voglio scoprire qualcosa di nuovo",
        personality: "E",
        points: 2,
      },
      { text: "Ho bisogno di staccare", personality: "F", points: 2 },
      { text: "Cerco momenti che restano", personality: "G", points: 2 },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Question.deleteMany({});

    await Question.insertMany(questions);

    console.log("Questions seeded successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
};

seedDB();
