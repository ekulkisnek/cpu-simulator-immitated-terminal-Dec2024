import { Pipeline } from './pipeline';
import { Cache } from './cache';
import { BranchPredictor } from './branch-predictor';

export class CPUCore {
  private pipeline: Pipeline;
  private l1ICache: Cache;
  private l1DCache: Cache;
  private l2Cache: Cache;
  private branchPredictor: BranchPredictor;
  private cycle: number = 0;
  private metrics: {
    ipc: number;
    branchAccuracy: number;
    powerConsumption: number;
  }[] = [];

  constructor() {
    this.pipeline = new Pipeline();
    this.l1ICache = new Cache(32 * 1024, 64); // 32KB L1 I-Cache
    this.l1DCache = new Cache(32 * 1024, 64); // 32KB L1 D-Cache
    this.l2Cache = new Cache(256 * 1024, 64); // 256KB L2 Cache
    this.branchPredictor = new BranchPredictor();
  }

  public reset() {
    this.cycle = 0;
    this.metrics = [];
    this.pipeline.reset();
    this.l1ICache.reset();
    this.l1DCache.reset();
    this.l2Cache.reset();
    this.branchPredictor.reset();
  }

  public step() {
    this.cycle++;
    const memOp = this.pipeline.step();

    // Handle memory operations with realistic address patterns
    if (memOp) {
      let addr;
      if (memOp.address) {
        // Use instruction's address if provided
        addr = `0x${memOp.address.toString(16)}`;
      } else {
        // Generate sequential access pattern with occasional jumps
        const baseAddr = (this.cycle * 4) % 0x1000; // Sequential access
        const offset = memOp.type === 'store' ? 0x100 : 0; // Different regions for loads/stores
        addr = `0x${(baseAddr + offset).toString(16)}`;
      }
      
      if (memOp.type === 'load') {
        this.l1DCache.access(addr, false);
      } else if (memOp.type === 'store') {
        this.l1DCache.access(addr, true);
      }
    }

    this.updateMetrics();
  }

  public getMetrics() {
    return {
      cycle: this.cycle,
      metrics: this.metrics,
      pipelineState: this.pipeline.getState(),
      cacheState: {
        l1d: this.l1DCache.getState(),
      },
      previousCacheState: {
        l1d: [...this.l1DCache.getState()],
      },
      cacheStats: {
        l1d: {
          hitRate: this.l1DCache.getHitRate(),
          missRate: this.l1DCache.getMissRate()
        }
      }
    };
  }

  private estimatePowerConsumption(): number {
    // Simple power estimation based on activity factors
    const pipelinePower = this.pipeline.getActivityFactor() * 0.5;
    const cachePower = 
      this.l1ICache.getActivityFactor() * 0.2 +
      this.l1DCache.getActivityFactor() * 0.2 +
      this.l2Cache.getActivityFactor() * 0.3;

    return pipelinePower + cachePower;
  }

  public loadProgram(instructions: string[]) {
    this.reset();
    this.pipeline.loadInstructions(instructions);
  }

  public setPipelineConfig(config: any) {
    this.pipeline.configure(config);
  }

  public setCacheConfig(config: any) {
    const { l1i, l1d, l2 } = config;
    this.l1ICache.configure(l1i);
    this.l1DCache.configure(l1d);
    this.l2Cache.configure(l2);
  }

  private updateMetrics() {
    this.metrics.push({
      ipc: this.pipeline.getIPC(),
      branchAccuracy: this.branchPredictor.getAccuracy(),
      powerConsumption: this.estimatePowerConsumption(),
    });
  }
}