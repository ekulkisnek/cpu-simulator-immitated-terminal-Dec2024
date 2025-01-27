export class Pipeline {
  private stages: {
    IF: string | null;
    ID: string | null;
    EX: string | null;
    MEM: string | null;
    WB: string | null;
  };
  private instructions: string[];
  private pc: number;
  private stalls: { [key: string]: boolean };
  private hazards: { [key: string]: string };
  private instructionsCompleted: number;

  constructor() {
    this.reset();
  }

  public reset() {
    this.stages = {
      IF: null,
      ID: null,
      EX: null,
      MEM: null,
      WB: null,
    };
    this.instructions = [];
    this.pc = 0;
    this.stalls = {};
    this.hazards = {};
    this.instructionsCompleted = 0;
  }

  public loadInstructions(instructions: string[]) {
    this.instructions = instructions;
    this.pc = 0;
  }

  public step() {
    // Write-Back Stage
    if (this.stages.WB) {
      this.instructionsCompleted++;
      this.stages.WB = null;
    }

    // Memory Stage
    this.stages.WB = this.stages.MEM;
    this.stages.MEM = this.stages.EX;

    // Execute Stage
    this.stages.EX = this.stages.ID;

    // Instruction Decode Stage
    this.stages.ID = this.stages.IF;

    // Instruction Fetch Stage
    if (this.pc < this.instructions.length && !this.stalls.IF) {
      this.stages.IF = this.instructions[this.pc];
      this.pc++;
    } else {
      this.stages.IF = null;
    }

    // Check for hazards
    this.detectHazards();

    // Return memory operation if current instruction is load/store
    const currentInstr = this.stages.MEM || '';
    if (currentInstr && (currentInstr.startsWith('lw') || currentInstr.startsWith('sw'))) {
      return currentInstr.startsWith('lw') ? { type: 'load', address: this.getAddress(currentInstr) } : { type: 'store', address: this.getAddress(currentInstr) };
    }
    return null;
  }

    private getAddress(instruction: string): number {
        //Extract address from instruction (this is highly simplified and needs improvement for real instructions)
        const match = instruction.match(/(\d+)/);
        return match ? parseInt(match[0], 10) : 0;
    }

  private detectHazards() {
    // Data hazards
    if (this.stages.EX && this.stages.ID) {
      const exDest = this.getDestinationRegister(this.stages.EX);
      const idSrc = this.getSourceRegisters(this.stages.ID);

      if (idSrc.some(src => src === exDest)) {
        this.hazards.ID = 'RAW Hazard';
        this.stalls.IF = true;
      }
    }

    // Control hazards
    if (this.stages.ID && this.isBranch(this.stages.ID)) {
      this.hazards.IF = 'Control Hazard';
      this.stalls.IF = true;
    }
  }

  private getDestinationRegister(instruction: string): string {
    // Simplified register extraction
    const match = instruction.match(/r(\d+)/);
    return match ? match[0] : '';
  }

  private getSourceRegisters(instruction: string): string[] {
    // Simplified source register extraction
    const matches = instruction.match(/r(\d+)/g) || [];
    return matches;
  }

  private isBranch(instruction: string): boolean {
    return instruction.startsWith('b') || instruction.startsWith('j');
  }

  public getState() {
    return Object.entries(this.stages).map(([name, instruction]) => ({
      name,
      instruction: instruction || undefined,
      stalled: !!this.stalls[name],
      hazard: this.hazards[name],
    }));
  }

  public getIPC(): number {
    return this.instructionsCompleted / (this.pc || 1);
  }

  public getActivityFactor(): number {
    return Object.values(this.stages).filter(Boolean).length / 5;
  }

  public configure(config: any) {
    // Configure pipeline parameters (forwarding, prediction, etc.)
  }
}