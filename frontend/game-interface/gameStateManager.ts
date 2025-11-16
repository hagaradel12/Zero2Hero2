class GameStateManager {
  private static userId: string | null = null;
  private static API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  static setUserId(userId: string) {
    this.userId = userId;
    console.log('✅ GameStateManager initialized for user:', userId);
  }

  static getUserId(): string | null {
    return this.userId;
  }

  static async loadState() {
    if (!this.userId) {
      console.warn('⚠️ No userId set in GameStateManager');
      return null;
    }

    try {
      const res = await fetch(`${this.API_BASE}/users/${this.userId}/game-state`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to load game state');
      }

      const state = await res.json();
      console.log('✅ Game state loaded from DB:', state);
      return state;
    } catch (err) {
      console.error('❌ Failed to load game state:', err);
      return null;
    }
  }

  static async saveState(sceneKey: string, levelId?: string, data: any = {}) {
    if (!this.userId) {
      console.warn('⚠️ No userId set, cannot save state');
      return;
    }

    try {
      const stateData: any = {
        currentScene: sceneKey,
        ...data,
      };

      if (levelId) {
        stateData.currentLevelId = levelId;
      }

      const res = await fetch(`${this.API_BASE}/users/${this.userId}/game-state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(stateData),
      });

      if (!res.ok) {
        throw new Error('Failed to save game state');
      }

      const result = await res.json();
      console.log('✅ Game state saved to DB:', result);
    } catch (err) {
      console.error('❌ Failed to save game state:', err);
    }
  }

  static async markQuestionComplete(levelId: string, questionIndex: number) {
    if (!this.userId) {
      console.warn('⚠️ No userId set, cannot mark question complete');
      return null;
    }

    console.log(`🎯 Marking question complete:`, { levelId, questionIndex, userId: this.userId });

    try {
      const res = await fetch(
        `${this.API_BASE}/users/${this.userId}/complete-question`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ levelId, questionIndex }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Server error:', errorText);
        throw new Error('Failed to mark question complete');
      }

      const data = await res.json();
      console.log('✅ Question marked complete - Server response:', data);
      
      // Return the updated completed questions for this level
      return data.completedQuestions;
    } catch (err) {
      console.error('❌ Failed to mark question complete:', err);
      return null;
    }
  }

  static async getCompletedQuestions(levelId: string): Promise<number[]> {
    if (!this.userId) {
      console.warn('⚠️ No userId set');
      return [];
    }

    console.log(`📊 Fetching completed questions for ${levelId}...`);

    try {
      const url = `${this.API_BASE}/users/${this.userId}/completed-questions/${levelId}`;
      console.log('🔗 Request URL:', url);

      const res = await fetch(url, {
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Server error:', errorText);
        throw new Error('Failed to get completed questions');
      }

      const data = await res.json();
      console.log(`✅ Server returned completed questions:`, data);
      
      const completed = data.completedQuestions || [];
      console.log(`📈 ${completed.length} questions completed for ${levelId}:`, completed);
      
      return completed;
    } catch (err) {
      console.error('❌ Failed to get completed questions:', err);
      return [];
    }
  }

  static async clearState() {
    if (!this.userId) {
      console.warn('⚠️ No userId set');
      return;
    }

    try {
      await this.saveState('IntroScene', 'lvl1', {
        completedQuestions: {},
      });
      console.log('🗑️ Game state cleared');
    } catch (err) {
      console.error('❌ Failed to clear game state:', err);
    }
  }

  static async checkLevelProgress(levelId: string) {
    if (!this.userId) {
      console.warn('⚠️ No userId set');
      return null;
    }

    console.log(`🎮 Checking level progress for ${levelId}...`);

    try {
      // Get level info
      const levelRes = await fetch(`${this.API_BASE}/levels/${levelId}`, {
        credentials: 'include',
      });
      const level = await levelRes.json();
      console.log('📋 Level info:', level);

      // Get completed questions
      const completed = await this.getCompletedQuestions(levelId);
      const completedCount = completed.length;
      const totalQuestions = level.totalQuestions;
      const isComplete = completedCount >= totalQuestions;

      const progress = {
        levelId,
        completedCount,
        totalQuestions,
        isComplete,
        nextLevelId: level.nextLevelId,
        nextScene: this.getSceneForLevel(level.nextLevelId),
      };

      console.log('📊 Level progress:', progress);
      return progress;
    } catch (err) {
      console.error('❌ Failed to check level progress:', err);
      return null;
    }
  }

  static getSceneForLevel(levelId: string | null): string | null {
    const map: { [key: string]: string } = {
      'lvl2': 'Scene1',
      'lvl3': 'Scene2',
      'lvl4': 'Scene3',
      'lvl5': 'Scene4',
    };
    return levelId ? map[levelId] : null;
  }

  static async tryAdvanceToNextScene(currentLevelId: string) {
    console.log(`🚀 Attempting to advance from ${currentLevelId}...`);

    const progress = await this.checkLevelProgress(currentLevelId);
    
    if (!progress) {
      return {
        canAdvance: false,
        nextScene: null,
        message: 'Failed to check progress',
      };
    }

    if (!progress.isComplete) {
      const message = `Complete all ${progress.totalQuestions} questions first! (${progress.completedCount}/${progress.totalQuestions})`;
      console.log('⚠️', message);
      return {
        canAdvance: false,
        nextScene: null,
        message,
      };
    }

    if (!progress.nextScene) {
      const message = 'You completed all levels! 🎉';
      console.log('🎉', message);
      return {
        canAdvance: false,
        nextScene: null,
        message,
      };
    }

    // Save new scene state
    await this.saveState(progress.nextScene, progress.nextLevelId);

    const message = `Level complete! Moving to ${progress.nextScene}`;
    console.log('✅', message);

    return {
      canAdvance: true,
      nextScene: progress.nextScene,
      message,
    };
  }
}

export default GameStateManager;