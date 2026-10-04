/* ===== TUTOR DIALOGUE (general lines) =====
   Each tutor has their own lines. {name} is replaced with the player's nickname. */
const LINES = {
  angelo: {
    pick: "Hey {name}. I'm Angelo. Pick a course and let's get started quickly.",
    mats: "Make your choice, {name}. Study the slides, then take on the quiz.",
    think: "Watch the clock.",
    right: "Nice one, {name}.",
    wrong: "Not quite. The correct answer is highlighted.",
    timeout: "Time's up! You should do better.",
    good: "Not bad, {name}. Let's get to the next one",
    retry: "Nice try, {name}. Review the slides and try again. Don't fail me.",
  },
  serena: {
    pick: "Hello, {name}! I'm Serena. Choose a course and we will begin together.",
    mats: "Which chapter shall we read first, {name}? Study, don't forget about the quiz!",
    think: "Think carefully... don't be slow now...",
    right: "Correct! Wonderful work, {name}!",
    wrong: "I expected better, look at the highlighted answer.",
    timeout: "Time is up! Do not worry, we are not done yet.",
    good: "Amazing, {name}! You have completed this chapter. On to the next one!",
    retry: "Good effort, {name}! Review the slides and try again. You can do this!",
  },
};

/* ===== COURSE CONTENT =====
   Each course (C) has materials (m). Each material:
   t = title
   s = slides: [slide title, bullet points[], tutor lines { angelo: "...", serena: "..." }]
   q = quiz:   [question, 4 options[], index of the correct option (0-3)] */
const C = [
  {
    id: "ep",
    n: "English Pronunciation",
    e: "",
    d: "Sounds, stress and clear speech",
    m: [
      {
        t: "Vowel Sounds",
        s: [
          [
            "Short vs Long Vowels",
            ["Short: ship /ɪ/, sit", "Long: sheep /iː/, seat", "Length changes the meaning"],
            {
              angelo: "Ship or sheep? One tiny sound changes the whole word, {name}!",
              serena: "Listen closely, {name}. Ship and sheep sound alike, but they are different words!",
            },
          ],
          [
            "Try It",
            ["/æ/ as in cat, /ʌ/ as in cup", "/ɑː/ as in car, /ɔː/ as in door", "Say each pair aloud"],
            {
              angelo: "Say each pair out loud. Don't be shy!",
              serena: "Listen first, then practice.",
            },
          ],
        ],
        q: [
          ["Which word has the long /iː/ sound?", ["ship", "sheep", "sit", "fit"], 1],
          ["'cat' has which vowel sound?", ["/æ/", "/ʌ/", "/ɑː/", "/ɔː/"], 0],
          ["Changing vowel length can change the...", ["Meaning", "Spelling only", "Volume", "Nothing"], 0],
        ],
      },
      {
        t: "Word Stress",
        s: [
          [
            "What is Stress?",
            [
              "The loudest, longest syllable",
              "Every longer word has one main stress",
              "Wrong stress can confuse listeners",
            ],
            {
              angelo: "Every word has a beat. Find it and you'll sound natural!",
              serena: "Every word has a rhythm. Let's find the strongest beat together.",
            },
          ],
          [
            "Common Patterns",
            [
              "Most 2-syllable nouns: stress first (TAble)",
              "Most 2-syllable verbs: stress second (reLAX)",
              "Mark stress with capitals",
            ],
            {
              angelo: "Nouns lead, verbs follow. Easy rule of thumb!",
              serena: "Here is a handy trick: nouns start strong, verbs finish strong.",
            },
          ],
        ],
        q: [
          ["Where is the stress in 'table'?", ["First syllable", "Second syllable", "Both", "Neither"], 0],
          ["'relax' is stressed on...", ["re-", "-lax", "Both equally", "No syllable"], 1],
          ["A stressed syllable is...", ["Louder and longer", "Silent", "Faster only", "Skipped"], 0],
        ],
      },
    ],
  },
  {
    id: "ess",
    n: "English Sentence Structure",
    e: "",
    d: "Build clear and correct sentences",
    m: [
      {
        t: "Basic Sentence Structure",
        s: [
          [
            "Basic Order",
            [
              "English follows S-V-O",
              "Subject: who or what acts",
              "Verb: the action.",
              "Object: receives it",
            ],
            {
              angelo: "English loves order: subject, then verb, then object.",
              serena: "Think of a sentence as a little story: who, does what, to whom.",
            },
          ],
          [
            "Examples",
            ["She reads books.", "Tom kicked the ball.", "Wrong: Reads she books."],
            {
              angelo: "Swap the order and the whole sentence falls apart.",
              serena: "See how the wrong example sounds odd? Order matters.",
            },
          ],
        ],
        q: [
          ["Basic English word order is...", ["S-V-O", "V-S-O", "O-S-V", "S-O-V"], 0],
          ["In 'Tom kicked the ball', the object is...", ["Tom", "kicked", "the ball", "None"], 2],
          ["She ... a new laptop. She doesn't like her old one.' What verb should fill in the blank?", ["is wanting", "wants", "want", "wanting"], 1],
        ],
      },
      {
        t: "Present Simple vs Present Continuous",
        s: [
          [
            "Present Simple",
            ["Used for general facts and permanent situations", "Used to describe routines and habits", "Used for scheduled events and timetables"],
            {
              angelo: "The present simple is for facts, habits, and schedules.",
              serena: "It describes things that are true in general or things we do regularly.",
            },
          ],
          [
            "Examples",
            ["I read newspapers at home.", "We work for ten hours a day.", "She interviews people on Fridays."],
            {
              angelo: "These are all examples of the present simple tense.",
              serena: "These sentences describe general truths, routines, and scheduled events.",
            },
          ],
          [
            "Present Continuous",
            ["Used for actions happening now", "Used to describe temporary situations", "Used with 'be' + -ing form of the verb"],
            {
              angelo: "The present continuous uses 'be' + the -ing form.",
              serena: "Think of it as 'is/are' + the action in progress.",
            },
          ],
          [
            "Examples",
            ["I am reading a book.", "We are working on a project.", "She is fixing the car."],
            {
              angelo: "These are all examples of the present continuous tense.",
              serena: "These sentences describe actions in progress or temporary situations.",
            },
          ],
        ],
        q: [
          ["Which tense is used for routines?", ["Present Simple", "Present Continuous", "Past Simple", "Future Simple"], 0],
          ["He ... to solve the problem right now.' What verb should fill in the blank?", ["is trying", "tries", "will try", "has tried"], 0],
          ["Which sentence describes a temporary situation?", ["I live in New York.", "I am living in New York for a month.", "I work at a bank.", "I read books."], 1],
        ],
      },
    ],
  },
];