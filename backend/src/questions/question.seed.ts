// import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Question } from './questions.schema';
// import { LevelsService } from '../levels/levels.service';

// @Injectable()
// export class QuestionsSeeder implements OnApplicationBootstrap {
//   private readonly logger = new Logger(QuestionsSeeder.name);

//   constructor(
//     @InjectModel(Question.name) private readonly questionModel: Model<Question>,
//     private readonly levelsService: LevelsService,
//   ) {}

//   async onApplicationBootstrap() {
//     this.logger.log('🚀 Seeding questions for Levels 2–5...');

//     const level2 = await this.levelsService.findByName('Functional Decomposition');
//     const level3 = await this.levelsService.findByName('Hierarchical Decomposition');
//     const level4 = await this.levelsService.findByName('Abstraction and Reuse');
//     const level5 = await this.levelsService.findByName('System Decomposition');

//     if (!level2 || !level3 || !level4 || !level5) {
//       this.logger.error('❌ One or more levels not found.');
//       return;
//     }

//     const questions = [
//       // ⚙️ LEVEL 2 — The Rune of Functions
//       {
//         title: '🧩 Challenge 1 – The Magic Shop System',
//         storyIntro: `You step into the glowing Enchanted Emporium, where shelves shimmer with potions, crystals, and ancient relics.
// The shopkeeper greets you warmly:

// “Ah, traveler! Every item here holds magic — and every loyal customer earns my gratitude in gold.”

// He shows you a Potion of Elixir, priced at $45.99, and whispers:

// “If you carry a loyalty badge, you shall receive a 10% discount off this potion’s price.”

// Your task: build a small program that helps the shopkeeper automatically calculate and display the total price for any purchase — applying the loyalty discount when it applies."`,
       
// task: `Design a simple system that:
// Lets the player choose an item to buy.

// Applies a 10% discount if the customer has a loyalty badge.
// Calculates and displays the final total clearly to the customer.

// Suggested structure:
// main()
//  ├── get_item_price()
//  ├── apply_discount(price, has_badge)
//  └── show_total(final_price)
// 🎯 Goal: Write clear, small functions that each do one thing.`,
//         level: level2._id,
//         order: 1,
//         xpReward: 150,
//         language: 'python',
//         expectedOutput: '', // left empty, can be filled later for validation
   
//       },
//       {
//         title: '🧩 Challenge 2 – Monster Stats Analyzer',
//         storyIntro: `You step into a training yard filled with monsters and warriors.
// Each monster has its own HP (Health Points) — some are weak, some are super strong!`,
//         task: `You have a list of monster HP values.
// Write a program using functions to:
// -Find the strongest monster (highest HP)
// -Find the weakest monster (lowest HP)
// -Calculate and display the average HP

// 🧠 Example:
// monsters = [100, 56, 35, 400, 534]`,
//         level: level2._id,
//         order: 2,
//         xpReward: 150,
//         language: 'python',
//         expectedOutput: '',
       
//       },
//       {
//         title: '⭐ Mini Quest – Refactor the Apprentice’s Mess',
//         storyIntro: `Forgemaster Lin frowns at the apprentice’s code — one long, tangled function that tries to do everything. 
// “Refactor this chaos,” she says, “and let each part stand alone in purpose.”`,
//         task: `You’ve been given messy code that calculates grades, sorts them, and prints summaries — all in one long function.
// Break it into smaller, meaningful functions with clear names, parameters, and returns.

// def process_data():
//     grades = [88, 92, 79, 93, 85]
//     total = 0
//     for g in grades:
//         total += g
//     avg = total / len(grades)
//     passed = 0
//     for g in grades:
//         if g >= 70:
//             passed += 1
//     print("Grades:", grades)
//     print("Average:", avg)
//     print("Students passed:", passed)

// process_data()
// 🎯 Goal: Practice modular thinking by refactoring existing code.`,
//         level: level2._id,
//         order: 3,
//         xpReward: 100,
//         language: 'python',
//         expectedOutput: '',
    
//       },

//       // 🏗️ LEVEL 3 — The Tower of Hierarchies
//     {
//   title: '🧩 Challenge 1 – The Palindrome Oracle',
//   storyIntro: `In the Cryptic Library, Architect Ada seeks to uncover hidden patterns within ancient texts. 
// Your task is to build a magical system that can tell whether a word reads the same forward and backward.`,
  
//   task: `🎯 Your goal: Create a **Palindrome Detector** using structured decomposition.

// It should:
// 1️⃣ Ask the user to enter a word or phrase  
// 2️⃣ Reverse the text  
// 3️⃣ Check if it is a palindrome  
// 4️⃣ Display a clear message about the result  

// 🧱 Suggested function hierarchy:
// main()
//  ├── get_input() → returns string
//  ├── reverse_text(word) → returns reversed string
//  ├── is_palindrome(word) → returns True/False
//  └── display_result(word, palindrome)

// 💡 Example:
// Input:
// "level"

// Output:
// The entered text is a palindrome.`,

//   level: level3._id,
//   order: 1,
//   xpReward: 200,
//   language: 'python',
//   expectedOutput: `Enter text: level
// The entered text is a palindrome.`,

// },

// {
//   title: '🧩 Challenge 2 – The Prime Scanner',
//   storyIntro: `In the Prime Kingdom, Architect Ada must identify all noble prime numbers in a sacred range of numbers.
// Your mission is to build a Prime Scanner that finds and reports them.`,
  
//   task: `🎯 Your goal: Implement a **Prime Scanner** using hierarchical decomposition.

// It should:
// 1️⃣ Ask the user for a start and end number  
// 2️⃣ Find all prime numbers within that range  
// 3️⃣ Display the list of primes and how many were found  

// 🧱 Suggested function hierarchy:
// main()
//  ├── get_range() → returns (start, end)
//  ├── is_prime(n) → returns True/False
//  ├── find_primes(start, end) → returns list of primes
//  └── show_primes(primes)
// 💡 Example:
// Input:
// Start = 5, End = 15

// Output:
// Primes in range: [5, 7, 11, 13]
// Total primes found: 4`,

//   level: level3._id,
//   order: 2,
//   xpReward: 200,
//   language: 'python',
//   expectedOutput: `Enter start: 5
// Enter end: 15
// Primes in range: [5, 7, 11, 13]
// Total primes found: 4`,

// },
// {
//   title: '🧩 Challenge 3 – The Perfect Number Inspector',
//   storyIntro: `In the Hall of Numbers, Architect Ada investigates mystical Perfect Numbers — those whose divisors add up exactly to themselves.
// Build a system that reveals all perfect numbers within a chosen range.`,
  
//   task: `🎯 Your goal: Construct a **Perfect Number Inspector** using hierarchical decomposition.

// It should:
// 1️⃣ Ask the user for a positive integer limit  
// 2️⃣ Calculate the sum of divisors for each number  
// 3️⃣ Determine if each number is perfect  
// 4️⃣ Display all perfect numbers found  

// 💡 Example:
// Input:
// 30
// Output:
// Perfect numbers up to 30: [6, 28]`,

//   level: level3._id,
//   order: 3,
//   xpReward: 250,
//   language: 'python',
//   expectedOutput: `Enter a number: 30
// Perfect numbers up to 30: [6, 28]`,

// },

// {
//   title: '🧩 Challenge 1 – The Recursive Archive',
//   storyIntro: `In the Hall of Whispers, lines of text echo endlessly through magic parchment.
// Sage Recursa hands you an old scroll and says:
// “Use your old powers — counting, recursion, and string work — to uncover its secrets.”
// `,
  
//   task: `🎯 Goal:
// Reuse and adapt existing recursion functions to build a text analyzer that can:
// 1️⃣ Count the total number of characters (recursively).
// 2️⃣ Count how many vowels appear (recursively).
// 3️⃣ Reverse the text (recursively).
// Then display all three results clearly.
// 🧱 Suggested hierarchy:
// main()
//  ├── count_chars(text)
//  ├── count_vowels(text)
//  ├── reverse_text(text)
//  └── show_report(length, vowels, reversed)
// 💡 Example Output:
// Enter text: recursion
// Characters: 9
// Vowels: 4
// Reversed: noisrucer
// `,

//   level: level4._id,
//   order: 1,
//   xpReward: 300,
//   language: 'python',
//   expectedOutput: '',
 
// },
// {
//   title: '🧩 Challenge 2 – The Tower of Numbers',
//   storyIntro: `In the Tower of Numbers, floating runes represent mathematical laws.
// Archmage Ada says:
// “You already know how to compute factorials and powers — now make them serve a new master: the sequence generator.”
// `,
  
//   task: `🎯 Goal:
// Reuse existing recursive functions (factorial(n) and power(base, exp)) to create a new program that generates and prints a special sequence:
// S(n)=n!+2^n

// for all n from 1 up to the user’s input.
// 🧱 Suggested hierarchy:
// main()
//  ├── factorial(n)       # reuse
//  ├── power(base, exp)   # reuse
//  ├── sequence_value(n)
//  ├── generate_sequence(limit)
//  └── display_sequence(values)
// 💡 Example Output:
// Enter limit: 5
// Sequence: [3, 6, 14, 40, 152]`,


//   level: level4._id,
//   order: 2,
//   xpReward: 300,
//   language: 'python',
//   expectedOutput: '',

// },

// {
//   title: '🧩 Final Challenge  – The Arcane Inventory System',
//   storyIntro: `In the Vault of Artifacts, every enchanted item the Academy owns is stored, tracked, and maintained.
// The Council of Codemasters tasks you, the senior apprentice, with designing the new Arcane Inventory System — a magical registry that keeps track of all artifacts, their rarity, and their magical energy.
// “You must build it from the ground up,” says Archmage Ada.
// “Plan every piece, from how items are recorded to how their energies are calculated.
// Your code will be the vault itself — organized, layered, and alive.”
// `,
  
//   task: `🎯 Goal
// Design and implement a multi-function system that can:
// 1️⃣ Add new magical items (name + energy + rarity)
// 2️⃣ List all stored items neatly
// 3️⃣ Find the item with the highest energy (slightly challenging function #1)
// 4️⃣ Estimate the total vault energy, combining normal loops with optional recursive energy boosting (slightly challenging function #2)
// 5️⃣ Display a full summary report

// 💡 Example Run
// --- Arcane Inventory System ---
// 1. Add item
// 2. List all
// 3. Find strongest
// 4. Show summary
// 5. Exit
// Choose an option: 1
// Enter name: Phoenix Feather
// Enter energy: 250
// Enter rarity (Common/Rare/Legendary): Legendary
// Item added!

// Choose an option: 1
// Enter name: Mana Crystal
// Enter energy: 120
// Enter rarity: Rare
// Item added!

// Choose an option: 3
// Strongest artifact: Phoenix Feather (250 energy)

// Choose an option: 4
// Vault energy: 370
// Total artifacts: 2
// Average energy: 185.0
// `,


//   level: level5._id,
//   order: 1,
//   xpReward: 400,
//   language: 'python',
//   expectedOutput: '',

// },





//     ];

//     for (const q of questions) {
//       try {
//         await this.questionModel.findOneAndUpdate(
//           { title: q.title },
//           q,
//           { upsert: true, new: true },
//         );
//         this.logger.log(`✅ Upserted: ${q.title}`);
//       } catch (error) {
//         this.logger.error(`❌ Error seeding ${q.title}: ${error.message}`);
//       }
//     }

//     this.logger.log('🎯 Levels 2–5 questions seeded successfully!');
//   }
// }
