// "use client"

// import type React from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Code2, Sparkles, Trophy, Target } from "lucide-react"

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Header */}
//       <header className="border-b border-border bg-card shadow-sm">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
//               <Code2 className="w-6 h-6 text-primary-foreground" />
//             </div>
//             <span className="text-xl font-bold text-foreground">Zero2Hero</span>
//           </div>

//           <nav className="hidden md:flex items-center gap-6">
//             <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
//               Features
//             </Link>
//             <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
//               How It Works
//             </Link>
//             <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
//               About
//             </Link>
//           </nav>

//           <div className="flex items-center gap-3">
//             <Button
//               className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold hover:from-orange-600 hover:to-pink-600"
//               variant="ghost"
//               asChild
//             >
//               <Link href="/login">Login</Link>
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="container mx-auto px-4 py-20 md:py-32 bg-background">
//         <div className="max-w-4xl mx-auto text-center animate-float-up">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
//             <Sparkles className="w-4 h-4 text-primary" />
//             <span className="text-sm font-medium text-foreground">AI-Powered Learning</span>
//           </div>

//           <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
//             Master Programming Through{" "}
//             <span className="text-primary">Problem Decomposition</span>
//           </h1>

//           <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
//             Zero2Hero is your AI tutor that guides you step-by-step through complex problems,
//             helping you build strong problem-solving skills instead of just providing answers.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//             <Button size="lg" asChild className="w-full sm:w-auto">
//               <Link href="/mainpage">Start Learning Free</Link>
//             </Button>
//             <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
//               <Link href="#how-it-works">See How It Works</Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="bg-muted py-20 border-t border-border">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
//               Learn Smarter, Not Harder
//             </h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Zero2Hero combines AI guidance with proven learning techniques to help you become a better programmer.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//             <FeatureCard
//               icon={<Target className="w-8 h-8 text-primary" />}
//               title="Step-by-step Guidance"
//               description="Learn to think like a programmer with reasoning prompts that build your problem-solving skills."
//             />
//             <FeatureCard
//               icon={<Sparkles className="w-8 h-8 text-secondary-foreground" />}
//               title="Smart Hint System"
//               description="Get targeted hints when you need them. Earn coins for progress and use them to unlock help."
//             />
//             <FeatureCard
//               icon={<Trophy className="w-8 h-8 text-accent-foreground" />}
//               title="Gamified Learning"
//               description="Track your progress with avatars, streaks, and achievements. Stay motivated as you level up your skills."
//             />
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section id="how-it-works" className="py-20 bg-background">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
//               Your Learning Journey
//             </h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Follow a proven process that transforms you from beginner to confident problem solver.
//             </p>
//           </div>

//           <div className="max-w-4xl mx-auto space-y-8">
//             <StepCard
//               number="1"
//               title="Submit Your Problem"
//               description="Paste your programming assignment or problem statement. You can even share your code attempt."
//             />
//             <StepCard
//               number="2"
//               title="Break It Down"
//               description="Our AI tutor helps you decompose the problem into manageable subproblems, teaching you to think systematically."
//             />
//             <StepCard
//               number="3"
//               title="Build & Test"
//               description="Solve each subproblem incrementally with guided hints. Test your solutions before moving forward."
//             />
//             <StepCard
//               number="4"
//               title="Reflect & Learn"
//               description="Complete quizzes to reinforce your understanding. Earn rewards and track your progress."
//             />
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-primary text-primary-foreground py-20">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Ready to Become a Better Programmer?
//           </h2>
//           <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
//             Join thousands of learners mastering problem decomposition with Zero2Hero.
//           </p>
//           <Button
//             size="lg"
//             className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold hover:from-orange-600 hover:to-pink-600"
//             asChild
//           >
//             <Link href="/dashboard">Start Your Journey</Link>
//           </Button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-border py-12 bg-card">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
//                 <Code2 className="w-5 h-5 text-primary-foreground" />
//               </div>
//               <span className="font-bold text-foreground">Zero2Hero</span>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               © 2025 Zero2Hero. Empowering novice programmers.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// /* --- FeatureCard --- */
// function FeatureCard({
//   icon,
//   title,
//   description,
// }: {
//   icon: React.ReactNode
//   title: string
//   description: string
// }) {
//   return (
//     <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary hover:shadow-md transition-all animate-float-up">
//       <div className="mb-4">{icon}</div>
//       <h3 className="text-xl font-bold mb-2 text-card-foreground">{title}</h3>
//       <p className="text-muted-foreground">{description}</p>
//     </div>
//   )
// }

// /* --- StepCard --- */
// function StepCard({
//   number,
//   title,
//   description,
// }: {
//   number: string
//   title: string
//   description: string
// }) {
//   return (
//     <div className="flex gap-6 items-start animate-slide-in-right">
//       <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
//         {number}
//       </div>
//       <div className="flex-1">
//         <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
//         <p className="text-muted-foreground">{description}</p>
//       </div>
//     </div>
//   )
// }


"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// ✅ Make sure these paths are correct
import book from "./../src/assets/book.png";
import potion from "./../src/assets/potion.png";
import hourglass from "./../src/assets/hourglasss.png";
import Link from "next/link";

export default function Home() {
  const features = [
  {
    title: "Focus Fragment",
    text: "Learn to break complex problems into smaller, clear steps — the foundation of every great coder.",
    image: hourglass,
  },
  {
    title: "Function Forge",
    text: "Craft reusable functions and modular solutions that make your code clean, efficient, and magical.",
    image: potion,
  },
  {
    title: "System Spellbook",
    text: "Combine your skills to design full systems — transforming your logic into working programs.",
    image: book,
  },
];


 return (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 text-white flex flex-col items-center justify-start py-16 px-6">
    {/* Floating Magical Icons */}
    <Image
      src="/magic/star.png"
      alt="star"
      width={40}
      height={40}
      className="absolute top-20 left-16 opacity-70 animate-pulse"
    />
    <Image
      src="/magic/heart.png"
      alt="heart"
      width={48}
      height={48}
      className="absolute bottom-32 right-20 opacity-60 animate-bounce"
    />
    <Image
      src="/magic/gem.png"
      alt="gem"
      width={56}
      height={56}
      className="absolute top-10 right-10 opacity-70 animate-spin-slow"
    />

    {/* HERO SECTION */}
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-2xl mt-10 z-10"
    >
      <h1 className="text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
        Unlock the Magic of <br />
        <span className="text-purple-300">Problem Decomposition</span>
      </h1>

      <p className="text-gray-300 mb-8 text-lg">
        Learn to think like a coder — one step at a time.  
        Break complex challenges into smaller quests, and master the art of turning ideas into code.
      </p>

     <Link href="/login">
      <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all">
        Start Your Journey →
  </button>
  </Link>

      <p className="mt-4 text-sm text-purple-300">
        From Zero to Hero — one function at a time.
      </p>
    </motion.section>

    {/* FEATURE CARDS */}
    <section className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl z-10">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-gradient-to-b from-purple-800/80 to-indigo-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md text-center border border-purple-700/30"
        >
          <Image
            src={feature.image}
            alt={feature.title}
            className="mx-auto mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            width={80}
            height={80}
          />
          <h2 className="text-2xl font-semibold mb-2">{feature.title}</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{feature.text}</p>
        </motion.div>
      ))}
    </section>

    {/* Magical Glow Overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(109,40,217,0.2),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.2),transparent_40%)] pointer-events-none"></div>
  </div>
);
}