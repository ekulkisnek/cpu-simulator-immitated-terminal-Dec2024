export class Cache {
  private size: number;
  private lineSize: number;
  private lines: Array<{
    valid: boolean;
    dirty: boolean;
    tag: string;
    data: string;
  }>;
  private hits: number = 0;
  private misses: number = 0;
  private activity: number = 0;

  constructor(size: number, lineSize: number) {
    this.size = size;
    this.lineSize = lineSize;
    this.reset();
  }

  public reset() {
    const numLines = this.size / this.lineSize;
    this.lines = Array(numLines).fill(null).map(() => ({
      valid: false,
      dirty: false,
      tag: '0x0',
      data: '0x0',
    }));
    this.hits = 0;
    this.misses = 0;
    this.activity = 0;
  }

  public access(address: string, isWrite: boolean = false): boolean {
    const { index, tag } = this.parseAddress(address);
    const hit = this.lines[index].valid && this.lines[index].tag === tag;
    
    if (hit) {
      this.hits++;
      if (isWrite) {
        this.lines[index].dirty = true;
        this.lines[index].data = `0x${Math.random().toString(16).substring(2, 10)}`;
      }
    } else {
      this.misses++;
      // Handle cache miss
      if (this.lines[index].valid && this.lines[index].dirty) {
        // Write back
        this.activity++;
      }
      this.lines[index] = {
        valid: true,
        dirty: isWrite,
        tag,
        data: `0x${Math.random().toString(16).substring(2, 10)}`,
      };
    }
    
    this.activity++;
    return hit;
  }

  private parseAddress(address: string): { index: number; tag: string } {
    const addr = parseInt(address, 16);
    const indexBits = Math.log2(this.size / this.lineSize);
    const offsetBits = Math.log2(this.lineSize);
    
    const index = (addr >> offsetBits) & ((1 << indexBits) - 1);
    const tag = (addr >> (offsetBits + indexBits)).toString(16);
    
    return { index, tag: `0x${tag}` };
  }

  public getHitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? this.hits / total : 0;
  }

  public getMissRate(): number {
    return 1 - this.getHitRate();
  }

  public getState() {
    return this.lines.map((line, index) => ({
      index,
      tag: line.tag,
      valid: line.valid,
      dirty: line.dirty,
      data: line.data,
    }));
  }

  public getActivityFactor(): number {
    return this.activity / (this.hits + this.misses);
  }

  public configure(config: any) {
    if (config.size) this.size = config.size;
    if (config.lineSize) this.lineSize = config.lineSize;
    this.reset();
  }
}
