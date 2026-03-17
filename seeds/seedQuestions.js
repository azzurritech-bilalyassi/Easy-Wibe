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
      { text: "Ho ancora voglia di fare cose", personality: "B", weights:{ A:2, C:1 } },
      { text: "Sto bene, ma senza esagerare", personality: "D", weights:{ B:2, G:1 } },
      {
        text: "Preferisco qualcosa di tranquillo",
        personality: "A",
        weights:{ E:2, C:1 }
      },
      { text: "Dipende dal momento", personality: "C", weights:{ D:2, B:1 } },
    ],
  },

  {
    question: "Quando esci, con chi ti piacerebbe stare?",
    order: 2,
    category: "Socialità",
    options: [
      { text: "...stare con più persone", personality: "D", weights:{ C:2, F:1 } },
      { text: "...condividere con una persona", personality: "G", weights:{ G:2, D:1 } },
      { text: "...fare qualcosa per conto mio", personality: "C", weights:{ D:2, B:1 } },
      { text: "...non ho preferenze", personality: "A", weights:{ B:2, D:1 }},
    ],
  },

  {
    question: "Quanto cerchi novità quando esci?",
    order: 3,
    category: "Novità",
    options: [
      { text: "Molto / massimo", personality: "E", weights:{ A:2, F:1 }},
      { text: "Mi piace alternare", personality: "D", weights:{ F:2, A:1 } },
      { text: "Meglio restare sul sicuro", personality: "A", weights:{ E:2, D:1 } },
      { text: "Dipende", personality: "C", weights:{ G:2, E:1 } },
    ],
  },

  {
    question: "Dove ti piacerebbe stare di più?",
    order: 4,
    category: "Ambiente",
    options: [
      { text: "In città", personality: "E", weights:{ E:2, C:1 } },
      { text: "All'aperto / fuori città", personality: "F", weights:{ G:2, E:1 } },
      { text: "Tranquillo e raccolto", personality: "A", weights:{ A:2, C:1 } },
      { text: "Deve succedere qualcosa", personality: "B", weights:{ C:2, E:1 } },
    ],
  },

  {
    question: "Quando sei in gruppo, come ti comporti?",
    order: 5,
    category: "Gruppo",
    options: [
      { text: "Tendo a guidare il gruppo", personality: "B", weights:{ E:2, F:1 } },
      {
        text: "Preferisco che decidano gli altri",
        personality: "D",
      weights:{ D:2, B:1 }
      },
      { text: "Mi va bene discutere", personality: "C", weights:{ G:2, F:1 } },
      { text: "Basta che succeda qualcosa", personality: "E", weights:{ F:2, A:1 } },
    ],
  },

  {
    question: "Cosa cerchi davvero quando esci?",
    order: 6,
    category: "Identità",
    options: [
      { text: "Se esco, devo farmi stare meglio", personality: "A", weights:{ D:2, B:1 }},
      { text: "Se esco, voglio sentirmi vivo", personality: "B", weights:{ B:2, D:1 } },
      {
        text: "Mi piace scegliere da solo cosa fare",
        personality: "C",
       weights:{ C:2, F:1 }
      },
      { text: "Conto con chi sono", personality: "D", weights:{ A:2, C:1 } },
      {
        text: "Voglio scoprire qualcosa di nuovo",
        personality: "E",
        weights:{ E:2, F:1 }
      },
      { text: "Ho bisogno di staccare", personality: "F", weights:{ G:2, F:1 } },
      { text: "Cerco momenti che restano", personality: "G", weights:{ F:2, A:1 } },
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
