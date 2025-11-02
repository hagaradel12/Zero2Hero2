import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question } from './questions.schema';
import { Level } from '../levels/levels.schema';
import { Users } from '../users/users.schema';
import { callAIReview, getAIHint } from 'src/utils/api';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Level.name) private readonly levelModel: Model<Level>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  // 🧩 Get all questions for a level
  async getQuestionsByLevel(levelId: string) {
    const questions = await this.questionModel.find({ level: levelId }).sort({ order: 1 }).lean();
    if (!questions.length) throw new NotFoundException('No questions found for this level');
    return questions;
  }

  // ⚙️ Get a single question by ID
  async getQuestionById(id: string) {
    const question = await this.questionModel.findById(id).lean();
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  // 💡 Reveal the next available hint
// 💡 Reveal a global user hint (not question-specific)
async useHint(userId: string, questionId: string, code: string, language: string) {
  const [user, question] = await Promise.all([
    this.userModel.findById(userId),
    this.questionModel.findById(questionId),
  ]);

  if (!user) throw new NotFoundException('User not found');
  if (!question) throw new NotFoundException('Question not found');

  if (user.Hints <= 0) {
    throw new BadRequestException('No hints left! Earn more XP or complete challenges to refill.');
  }

  // Try getting an AI-generated hint
  try {
    const aiHint = await getAIHint({
      userId,
      questionId,
      task: question.task || question.title || 'unknown task',
      code,
      language: 'python',
    });

    // Deduct one hint after successful request
    user.Hints -= 1;
    await user.save();

    return {
      hint: aiHint.hint,
      explanation: aiHint.explanation || null,
      remainingHints: user.Hints,
      source: 'ai',
    };
  } catch (err) {
    console.error('⚠️ Failed to fetch AI hint:', err.message);
    throw new BadRequestException('Hint service unavailable. Try again later.');
  }
}

  // 🧠 AI Code Review (no XP here — just feedback)
  async reviewCode(userId: string, questionId: string, code: string, language: 'python' | 'java') {
    if (!Types.ObjectId.isValid(userId))
      throw new BadRequestException('Invalid userId');

    const [user, question] = await Promise.all([
      this.userModel.findById(userId),
      this.questionModel.findById(questionId),
    ]);

    if (!user) throw new NotFoundException('User not found');
    if (!question) throw new NotFoundException('Question not found');

    // 📝 Record review submission
    const submission = {
      userId: new Types.ObjectId(userId),
      code,
      score: 0,
      feedback: 'Review pending...',
      passed: false,
      date: new Date(),
    };

    question.submissions.push(submission);
    await question.save();

    // 🤖 Get AI review
    const aiResponse = await callAIReview({
      userId,
      questionId,
      code,
      expectedOutput: question.expectedOutput,
      language,
      task: question.task,
    });

    const latest = question.submissions[question.submissions.length - 1];
    latest.score = aiResponse?.score ?? 0;
    latest.feedback = aiResponse?.feedback ?? 'No feedback available';
    latest.passed = latest.score >= 85;
    await question.save();

    return {
      score: latest.score,
      feedback: latest.feedback,
      passed: latest.passed,
    };
  }

  // 🏁 Finish Question → Updates XP, Streak, and marks question as completed
 async finishQuestion(userId: string, questionId: string, finalScore: number) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestException('Invalid userId');
  }

  const [user, question] = await Promise.all([
    this.userModel.findById(userId),
    this.questionModel.findById(questionId),
  ]);

  if (!user || !question) {
    throw new NotFoundException('User or question not found');
  }

  // ✅ Check if this user already finished this question
  if (user.solvedQuestions.includes(questionId)) {
    throw new BadRequestException('You have already finished this question.');
  }

  // 🧾 Add submission record (for history)
  question.submissions.push({
    userId: new Types.ObjectId(userId),
    code: '',
    score: finalScore,
    passed: finalScore >= 85,
    feedback: '',
    date: new Date(),

  });

  // 💎 Calculate XP earned
  const xpEarned = Math.round((finalScore / 100) * question.xpReward);
  user.xp += xpEarned;

  // 🧠 Mark this question as solved for this user
  user.solvedQuestions.push(questionId);

  // 🔥 Update streak
  const today = new Date().toDateString();
  const lastActive = user.lastActiveDate
    ? new Date(user.lastActiveDate).toDateString()
    : null;

  if (!lastActive || today !== lastActive) {
    const isNextDay =
      lastActive &&
      new Date(today).getTime() - new Date(lastActive).getTime() === 86400000;
    user.streak = isNextDay ? user.streak + 1 : 1;
  }

  user.lastActiveDate = new Date();

  // 💾 Save both
  await Promise.all([question.save(), user.save()]);

  return {
    message:
      finalScore === 100
        ? '🏆 Perfect! Question fully solved and finished.'
        : '✅ Question finished successfully.',
    xpEarned,
    totalXP: user.xp,
    streak: user.streak,
  };
}

}
