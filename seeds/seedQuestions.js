const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("../models/Question");

dotenv.config();

const questions = [
  /* ---------------- NORMAL QUESTIONS ---------------- */

  {
    question: "Cosa fai di default?",
    order: 1,
    category: "Energia",
    options: [
      {
        text: "Doccia, felpa, posto tranquillo",
        personality: "A",
        weights: { A: 2, C: 1 },
      },
      {
        text: "Raga, dove si balla?",
        personality: "B",
        weights: { B: 2, G: 1 },
      },
      {
        text: "Posto nuovo, anche solo per curiosare",
        personality: "E",
        weights: { E: 2, C: 1 },
      },
      {
        text: "Scrivi sul gruppo: Chi è libero?",
        personality: "D",
        weights: { D: 2, B: 1 },
      },
    ],
  },

  {
    question: "La tua batteria sociale è…",
    order: 2,
    category: "Socialità",
    options: [
      {
        text: "Posto mio, zero sbatti",
        personality: "C",
        weights: { C: 2, F: 1 },
      },
      {
        text: "Poche persone, ma le mie",
        personality: "G",
        weights: { G: 2, D: 1 },
      },
      {
        text: "Caos controllato e risate",
        personality: "D",
        weights: { D: 2, B: 1 },
      },
      { text: "Finché non chiude", personality: "B", weights: { B: 2, D: 1 } },
    ],
  },

  {
    question: "Non la vuoi buttare via.",
    order: 3,
    category: "Novità",
    options: [
      {
        text: "Brunch lento + passeggiata senza meta",
        personality: "A",
        weights: { A: 2, F: 1 },
      },
      {
        text: "Fuori città: verde, aria, silenzio",
        personality: "F",
        weights: { F: 2, A: 1 },
      },
      {
        text: "Mostra, mercatino o qualcosa da scoprire",
        personality: "E",
        weights: { E: 2, D: 1 },
      },
      {
        text: "Coppia mode: soft, zero fretta",
        personality: "G",
        weights: { G: 2, E: 1 },
      },
    ],
  },

  {
    question: "Piove forte: come salvi l’uscita?",
    order: 4,
    category: "Ambiente",
    options: [
      {
        text: "Cinema o mostra: luci spente, zero rumore",
        personality: "E",
        weights: { E: 2, C: 1 },
      },
      {
        text: "Ristorante intimo, due chiacchiere",
        personality: "G",
        weights: { G: 2, E: 1 },
      },
      {
        text: "Casa: playlist, comfort food, pace",
        personality: "A",
        weights: { A: 2, C: 1 },
      },
      {
        text: "Solo: hobby, foto, disegno, mini-progetto",
        personality: "C",
        weights: { C: 2, E: 1 },
      },
    ],
  },

  {
    question: "Cosa scegli per una serata giusta?",
    order: 5,
    category: "Gruppo",
    options: [
      {
        text: "Street food + camminata",
        personality: "E",
        weights: { E: 2, F: 1 },
      },
      {
        text: "Birretta easy, ma in compagnia",
        personality: "D",
        weights: { D: 2, B: 1 },
      },
      {
        text: "Casa in due: vino o soft drink, mood carino",
        personality: "G",
        weights: { G: 2, F: 1 },
      },
      {
        text: "Tramonto fuori: aria fresca",
        personality: "F",
        weights: { F: 2, A: 1 },
      },
    ],
  },

  {
    question: "Sono le 21:30: tu…",
    order: 6,
    category: "Identità",
    options: [
      {
        text: "Raduno 2–3 persone e si risolve in 5 minuti",
        personality: "D",
        weights: { D: 2, B: 1 },
      },
      {
        text: "Scelgo musica alta e mi lascio andare",
        personality: "B",
        weights: { B: 2, D: 1 },
      },
      {
        text: "Esco da solo: giro, cuffie, vibe personale",
        personality: "C",
        weights: { C: 2, F: 1 },
      },
      {
        text: "A letto presto: domani ringrazio",
        personality: "A",
        weights: { A: 2, C: 1 },
      },
    ],
  },

  {
    question: "Come ti muovi per sentirti a casa?",
    order: 7,
    category: "Esplorazione",
    options: [
      {
        text: "Posto dove si parla e si conosce gente easy",
        personality: "D",
        weights: { D: 2, B: 1 },
      },
      {
        text: "Mi perdo tra vie, gallerie, mostre",
        personality: "E",
        weights: { E: 2, C: 1 },
      },
      {
        text: "Parco grande, vista, natura vicino",
        personality: "F",
        weights: { F: 2, A: 1 },
      },
      {
        text: "Serata a due: posti belli e atmosfera",
        personality: "G",
        weights: { G: 2, E: 1 },
      },
    ],
  },

  {
    question: "Se la serata fosse musica…",
    order: 8,
    category: "Mood",
    options: [
      {
        text: "Jazz: luci calde, ritmo lento",
        personality: "A",
        weights: { A: 2, G: 1 },
      },
      {
        text: "Techno o bass: volume alto, zero pensieri",
        personality: "B",
        weights: { B: 2, D: 1 },
      },
      {
        text: "Soul o R&B: cuffie e camminata",
        personality: "C",
        weights: { C: 2, F: 1 },
      },
      {
        text: "Indie pop: questa ce la ricordiamo",
        personality: "G",
        weights: { G: 2, E: 1 },
      },
    ],
  },

  {
    question: "Quando vuoi staccare davvero…",
    order: 9,
    category: "Relax",
    options: [
      {
        text: "Notte lunga: mi serve casino per spegnere la testa",
        personality: "B",
        weights: { B: 2, D: 1 },
      },
      {
        text: "Rituale: un posto mio, silenzio dentro",
        personality: "A",
        weights: { A: 2, C: 1 },
      },
      {
        text: "Aria aperta: cammino finché torna il respiro",
        personality: "F",
        weights: { F: 2, A: 1 },
      },
      {
        text: "Giro easy con qualcuno: quelli giusti",
        personality: "G",
        weights: { G: 2, F: 1 },
      },
    ],
  },

  /* ---------------- TIE BREAK QUESTIONS ---------------- */

  {
    question: "Hai 2 ore libere.",
    order: 100,
    category: "SPAREGGIO",
    options: [
      {
        text: "Luci basse, posto piccolo, ritmo lento",
        personality: "A",
        weights: { A: 1 },
      },
      {
        text: "Volume alto e si va dove c’è energia",
        personality: "B",
        weights: { B: 1 },
      },
    ],
  },

  {
    question: "La serata perfetta quando sei stanco è:",
    order: 101,
    category: "SPAREGGIO",
    options: [
      {
        text: "Rituale soft: tè, playlist e pace",
        personality: "A",
        weights: { A: 1 },
      },
      {
        text: "Me-time: cuffie e hobby tutto mio",
        personality: "C",
        weights: { C: 1 },
      },
    ],
  },

  {
    question: "Se devi salvare l’uscita fai così:",
    order: 102,
    category: "SPAREGGIO",
    options: [
      {
        text: "Scelgo un posto tranquillo e mi ricarico",
        personality: "A",
        weights: { A: 1 },
      },
      {
        text: "Scrivo a 2–3 persone e si decide in 5 minuti",
        personality: "D",
        weights: { D: 1 },
      },
    ],
  },

  {
    question: "Ti attira di più:",
    order: 103,
    category: "SPAREGGIO",
    options: [
      {
        text: "Il mio posto sicuro: cozy e senza sorprese",
        personality: "A",
        weights: { A: 1 },
      },
      {
        text: "Un posto nuovo, anche solo per curiosare",
        personality: "E",
        weights: { E: 1 },
      },
    ],
  },

  {
    question: "Per staccare davvero scegli:",
    order: 104,
    category: "SPAREGGIO",
    options: [
      {
        text: "Calma indoor: divano, film e silenzio dentro",
        personality: "A",
        weights: { A: 1 },
      },
      {
        text: "Aria fuori: cammino e mi svuoto la testa",
        personality: "F",
        weights: { F: 1 },
      },
    ],
  },

  {
    question: "Il mood giusto è:",
    order: 105,
    category: "SPAREGGIO",
    options: [
      {
        text: "Slow vibe: poche cose, fatte bene, zero fretta",
        personality: "A",
        weights: { A: 1 },
      },
      {
        text: "Dating: due chiacchiere e atmosfera",
        personality: "G",
        weights: { G: 1 },
      },
    ],
  },

  /* ---------- Additional tie-break questions from JSON not in original seed ---------- */

  {
    question: "Se la serata fosse una mossa secca:",
    order: 106,
    category: "SPAREGGIO",
    options: [
      {
        text: "Gente, musica, adrenalina",
        personality: "B",
        weights: { B: 1 },
      },
      {
        text: "Solo io: cuffie e città che scorre",
        personality: "C",
        weights: { C: 1 },
      },
    ],
  },

  {
    question: "In compagnia ti viene più:",
    order: 107,
    category: "SPAREGGIO",
    options: [
      {
        text: "Alzare il livello: si balla e si spinge",
        personality: "B",
        weights: { B: 1 },
      },
      {
        text: "Giro easy: risate, zero drama, quelli giusti",
        personality: "D",
        weights: { D: 1 },
      },
    ],
  },

  {
    question: "Vuoi più:",
    order: 108,
    category: "SPAREGGIO",
    options: [
      {
        text: "Un posto dove succede qualcosa",
        personality: "B",
        weights: { B: 1 },
      },
      {
        text: "Un posto nuovo da scoprire",
        personality: "E",
        weights: { E: 1 },
      },
    ],
  },

  {
    question: "Quando sei pieno di pensieri:",
    order: 109,
    category: "SPAREGGIO",
    options: [
      {
        text: "Casino controllato per spegnere la testa",
        personality: "B",
        weights: { B: 1 },
      },
      {
        text: "Natura, aria: sparisco e respiro",
        personality: "F",
        weights: { F: 1 },
      },
    ],
  },

  {
    question: "Scelta secca del sabato sera:",
    order: 110,
    category: "SPAREGGIO",
    options: [
      {
        text: "Dancefloor e nottata lunga",
        personality: "B",
        weights: { B: 1 },
      },
      { text: "Posto intimo in due", personality: "G", weights: { G: 1 } },
    ],
  },

  {
    question: "Alle 21:30 ti parte più:",
    order: 111,
    category: "SPAREGGIO",
    options: [
      {
        text: "Esco da solo: giro libero, vibe personale",
        personality: "C",
        weights: { C: 1 },
      },
      {
        text: "Raduno 2–3 persone e si fa qualcosa",
        personality: "D",
        weights: { D: 1 },
      },
    ],
  },

  {
    question: "Ti accende di più:",
    order: 112,
    category: "SPAREGGIO",
    options: [
      {
        text: "Hobby e creatività: sto bene per conto mio",
        personality: "C",
        weights: { C: 1 },
      },
      {
        text: "Scoperta: mercatino, mostra, nuove vie",
        personality: "E",
        weights: { E: 1 },
      },
    ],
  },

  {
    question: "Se devi decomprimere scegli:",
    order: 113,
    category: "SPAREGGIO",
    options: [
      {
        text: "Cuffie e solitudine buona",
        personality: "C",
        weights: { C: 1 },
      },
      {
        text: "Aria aperta e respiro lungo",
        personality: "F",
        weights: { F: 1 },
      },
    ],
  },

  {
    question: "La tua serata giusta è:",
    order: 114,
    category: "SPAREGGIO",
    options: [
      {
        text: "Solo mode: tranquillo e centrato",
        personality: "C",
        weights: { C: 1 },
      },
      {
        text: "In due: intimità e tempo lento",
        personality: "G",
        weights: { G: 1 },
      },
    ],
  },

  {
    question: "Scegli senza pensarci:",
    order: 115,
    category: "SPAREGGIO",
    options: [
      {
        text: "Persone prima: compagnia e spontaneità",
        personality: "D",
        weights: { D: 1 },
      },
      {
        text: "Luoghi prima: scopro qualcosa di nuovo",
        personality: "E",
        weights: { E: 1 },
      },
    ],
  },

  {
    question: "Domenica pomeriggio è più:",
    order: 116,
    category: "SPAREGGIO",
    options: [
      {
        text: "Giro easy con qualcuno, zero sbatti",
        personality: "D",
        weights: { D: 1 },
      },
      {
        text: "Fuori città: aria, silenzio, reset",
        personality: "F",
        weights: { F: 1 },
      },
    ],
  },

  {
    question: "Per sentirti a casa preferisci:",
    order: 117,
    category: "SPAREGGIO",
    options: [
      {
        text: "Gruppetto giusto e serata leggera",
        personality: "D",
        weights: { D: 1 },
      },
      {
        text: "Una persona sola, ma quella giusta",
        personality: "G",
        weights: { G: 1 },
      },
    ],
  },

  {
    question: "Ti richiama di più:",
    order: 118,
    category: "SPAREGGIO",
    options: [
      {
        text: "Vie, mostre, spot nuovi in città",
        personality: "E",
        weights: { E: 1 },
      },
      {
        text: "Verde, spazio: mi stacco da tutto",
        personality: "F",
        weights: { F: 1 },
      },
    ],
  },

  {
    question: "L’idea che ti piace di più è:",
    order: 119,
    category: "SPAREGGIO",
    options: [
      {
        text: "Scoprire un posto nuovo, anche a caso",
        personality: "E",
        weights: { E: 1 },
      },
      {
        text: "Andare in un posto bello, ma in due",
        personality: "G",
        weights: { G: 1 },
      },
    ],
  },

  {
    question: "Se vuoi staccare scegli:",
    order: 120,
    category: "SPAREGGIO",
    options: [
      {
        text: "Aria aperta: cammino e mi resetto",
        personality: "F",
        weights: { F: 1 },
      },
      {
        text: "Atmosfera in due: tempo lento e vicino",
        personality: "G",
        weights: { G: 1 },
      },
    ],
  },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Question.deleteMany({});
  await Question.insertMany(questions);
  console.log("Quiz Questions Seeded");
  process.exit();
};

seedDB();
