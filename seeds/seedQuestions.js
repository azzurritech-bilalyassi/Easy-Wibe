const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("../models/Question");
dotenv.config();

const questions = [
  {
    question: "Dopo una giornata tipo, come ti senti quando pensi di uscire?",
    order: 1,
    category: "Energia", // opzionale, ma utile per frontend
    options: [
      { text: "Ho ancora voglia di fare cose", value: "HighEnergy" },
      { text: "Sto bene, ma senza esagerare", value: "ModerateEnergy" },
      { text: "Preferisco qualcosa di tranquillo", value: "LowEnergy" },
      { text: "Dipende dal momento", value: "EnergyDepends" },
    ],
  },
  {
    question: "Quando esci, con chi ti piacerebbe stare?",
    order: 2,
    category: "Socialità",
    options: [
      { text: "...stare con più persone", value: "Group" },
      { text: "...condividere con una persona", value: "OneOnOne" },
      { text: "...fare qualcosa per conto mio", value: "Alone" },
      { text: "...non ho preferenze", value: "SocialNoPreference" },
    ],
  },
  {
    question: "Quanto cerchi novità quando esci?",
    order: 3,
    category: "Novità",
    options: [
      { text: "Molto / massimo", value: "HighNovelty" },
      { text: "Mi piace alternare", value: "ModerateNovelty" },
      { text: "Meglio restare sul sicuro", value: "LowNovelty" },
      { text: "Dipende", value: "NoveltyDepends" },
    ],
  },
  {
    question: "Dove ti piacerebbe stare di più?",
    order: 4,
    category: "Ambiente",
    options: [
      { text: "In città", value: "City" },
      { text: "All'aperto / fuori città", value: "Outdoors" },
      { text: "Tranquillo e raccolto", value: "Calm" },
      { text: "Deve succedere qualcosa", value: "SomethingHappens" },
    ],
  },
  {
    question: "Quando sei in gruppo, come ti comporti?",
    order: 5,
    category: "Gruppo",
    options: [
      { text: "Tendo a guidare il gruppo", value: "Leader" },
      { text: "Preferisco che decidano gli altri", value: "Follower" },
      { text: "Mi va bene discutere", value: "Discuss" },
      { text: "Basta che succeda qualcosa", value: "GroupAny" },
    ],
  },
  {
    question: "Cosa cerchi davvero quando esci?",
    order: 6,
    category: "Identità",
    options: [
      { text: "Se esco, devo farmi stare meglio", value: "SelfCare" },
      { text: "Se esco, voglio sentirmi...", value: "Feeling" },
      { text: "Mi piace scegliere da solo cosa fare", value: "Independent" },
      { text: "Conto con chi sono", value: "WithOthers" },
      { text: "Voglio scoprire qualcosa di nuovo", value: "Discover" },
      { text: "Ho bisogno di staccare", value: "Relax" },
      { text: "Cerco momenti che restano", value: "Memorable" },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
};

seedDB();
