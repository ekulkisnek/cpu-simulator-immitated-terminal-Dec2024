export class BranchPredictor {
  private predictionTable: Map<number, number>;
  private correct: number = 0;
  private total: number = 0;

  constructor() {
    this.reset();
  }

  public reset() {
    this.predictionTable = new Map();
    this.correct = 0;
    this.total = 0;
  }

  public predict(pc: number): boolean {
    const state = this.predictionTable.get(pc) || 2; // Default: Weakly Taken
    return state > 1;
  }

  public update(pc: number, taken: boolean) {
    let state = this.predictionTable.get(pc) || 2;
    const prediction = state > 1;
    
    if (prediction === taken) {
      this.correct++;
    }
    this.total++;

    // Update 2-bit saturating counter
    if (taken && state < 3) {
      state++;
    } else if (!taken && state > 0) {
      state--;
    }
    
    this.predictionTable.set(pc, state);
  }

  public getAccuracy(): number {
    return this.total > 0 ? this.correct / this.total : 1;
  }
}
