// import { connect } from 'mongoose';
// import { Level, LevelDocument } from './level/level.schema';
// import { Puzzle, PuzzleDocument } from './puzzle/puzzle.schema';

// async function seed() {
//   await connect('mongodb://localhost:27017/zerotohero');

//   // ===== Room 1 =====
//   const room1Puzzles: PuzzleDocument[] = await Puzzle.create([
//     {
//       title: 'Task A — Clean the Corrupted Logs',
//       guidance: `Extract digits from the corrupted log string.`,
//       testCases: [
//         { input: '@2#1!8&', expectedOutput: '218' },
//         { input: 'a1b2c3', expectedOutput: '123' },
//       ],
//       index: 0,
//     },
//     {
//       title: 'Task B — Extract the Password Fragment',
//       guidance: `Sum only even digits.`,
//       testCases: [
//         { input: '218', expectedOutput: 10 },
//         { input: '1234', expectedOutput: 6 },
//       ],
//       index: 1,
//     },
//   ]);

//   const room1: LevelDocument = await Level.create({
//     levelId: "room1",
//     title: 'Room 1: Old Data Center',
//     description: 'Find damaged logs, extract digits.',
//     puzzles: room1Puzzles.map(p => p._id),
//     totalQuestions: room1Puzzles.length,
//     nextLevelId: 'room2',
//     isLocked: false,
//   });

//   // ===== Room 2 =====
//   const room2Puzzles: PuzzleDocument[] = await Puzzle.create([
//     {
//       title: 'Count Occurrences of Pattern',
//       guidance: `Count non-overlapping occurrences of a pattern.`,
//       testCases: [
//         { input: { signal: 'ABABXABABABZ', pattern: 'AB' }, expectedOutput: 6 },
//       ],
//       index: 0,
//     },
//     {
//       title: 'Longest Consecutive Pattern Streak',
//       guidance: `Find longest consecutive repetition of the pattern.`,
//       testCases: [
//         { input: { signal: 'ABABXABABABZ', pattern: 'AB' }, expectedOutput: 3 },
//       ],
//       index: 1,
//     },
//   ]);

//   const room2: LevelDocument = await Level.create({
//     levelId: "room2",
//     title: 'Room 2: Network Operations Room',
//     description: 'Analyze repeating signals to detect anomalies.',
//     puzzles: room2Puzzles.map(p => p._id),
//     totalQuestions: room2Puzzles.length,
//     nextLevelId: 'room3',
//     isLocked: true,
//   });

//   // ===== Room 3 =====
//   const room3Puzzles: PuzzleDocument[] = await Puzzle.create([
//     {
//       title: 'Count Even Numbers in Segment 1',
//       guidance: `Count even numbers in first backup segment.`,
//       testCases: [
//         { input: [2,3,4,5], expectedOutput: 2 },
//       ],
//       index: 0,
//     },
//     {
//       title: 'Count Even Numbers in Segment 2',
//       guidance: `Count even numbers in second backup segment.`,
//       testCases: [
//         { input: [6,8,10,3], expectedOutput: 3 },
//       ],
//       index: 1,
//     },
//     {
//       title: 'Find Maximum Even Count Across Segments',
//       guidance: `Determine which segment has the highest even count.`,
//       testCases: [
//         { input: [[2,3,4,5],[6,8,10,3],[1,2,2,4]], expectedOutput: 3 },
//       ],
//       index: 2,
//     },
//   ]);

//   const room3: LevelDocument = await Level.create({
//     levelId: "room3",
//     title: 'Room 3: Backup & Recovery Storage',
//     description: 'Analyze backup segments and find the strongest one.',
//     puzzles: room3Puzzles.map(p => p._id),
//     totalQuestions: room3Puzzles.length,
//     nextLevelId: "room4",
//     isLocked: true,
//   });

//   // ===== Room 4 =====
//   const room4Puzzles: PuzzleDocument[] = await Puzzle.create([
//     {
//       title: 'Segment Binary String',
//       guidance: 'Divide binary string into 8-bit blocks.',
//       testCases: [
//         { input: '010001000100010101000011', expectedOutput: ['01000100','01000101','01000011'] },
//       ],
//       index: 0,
//     },
//     {
//       title: 'Binary to ASCII Conversion',
//       guidance: 'Convert 8-bit segments to characters.',
//       testCases: [
//         { input: ['01000100','01000101','01000011'], expectedOutput: ['D','E','C'] },
//       ],
//       index: 1,
//     },
//     {
//       title: 'Reorder to Form Password Fragment',
//       guidance: 'Reorder decoded characters to form fragment.',
//       testCases: [
//         { input: { chars: ['D','E','C'], pattern: [0,1,2] }, expectedOutput: 'DEC' },
//       ],
//       index: 2,
//     },
//   ]);

//   const room4: LevelDocument = await Level.create({
//     levelId: "room4",
//     title: 'Room 4: Cybersecurity Forensics Lab',
//     description: 'Decode binary logs to reveal next password fragment.',
//     puzzles: room4Puzzles.map(p => p._id),
//     totalQuestions: room4Puzzles.length,
//     nextLevelId: "room5",
//     isLocked: true,
//   });

//   // ===== Room 5 =====
//   const room5Puzzles: PuzzleDocument[] = await Puzzle.create([
//     {
//       title: 'Assemble Letter Portion',
//       guidance: 'Extract letters from hidden codes.',
//       testCases: [
//         { input: ["O2","M0","P5","S1","E3","E4"], expectedOutput: 'OMPOSE' },
//       ],
//       index: 0,
//     },
//     {
//       title: 'Combine All Fragments',
//       guidance: 'Combine numeric fragments and decoded IDs with letters to form full password.',
//       testCases: [
//         { input: { fragments: [8,5,4,'DEC'], letters: 'OMPOSE' }, expectedOutput: '8-5-4-DEC-OMPOSE' },
//       ],
//       index: 1,
//     },
//   ]);

//   const room5: LevelDocument = await Level.create({
//     levelId: "room5",
//     title: 'Room 5: Executive Security Vault',
//     description: 'Combine all fragments to shut down server.',
//     puzzles: room5Puzzles.map(p => p._id),
//     totalQuestions: room5Puzzles.length,
//     nextLevelId: "room5",
//     isLocked: true,
//   });

//   // Link levels sequentially
//   await Level.findByIdAndUpdate(room1._id, { nextLevelId: room2._id });
//   await Level.findByIdAndUpdate(room2._id, { nextLevelId: room3._id });
//   await Level.findByIdAndUpdate(room3._id, { nextLevelId: room4._id });
//   await Level.findByIdAndUpdate(room4._id, { nextLevelId: room5._id });

//   console.log('✅ Seed completed!');
//   process.exit(0);
// }

// seed().catch(console.error);
