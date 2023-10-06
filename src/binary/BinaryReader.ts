import { IBinaryAdapter } from './IBinaryAdapter';

class BinaryReader {
  public readonly buffer: Buffer;
  public readonly length: number;

  private _isDone: boolean = false;
  private _offset: number = 0;

  get offset(): number {
    return this._offset;
  }

  get remainingBytes(): number {
    return this.length - this.offset;
  }

  get isDone(): boolean {
    return this._isDone;
  }

  constructor(buffer: Buffer, offset: number = 0) {
    this.buffer = buffer;
    this.length = buffer.byteLength;

    this._offset = offset;

    this.moveOffset = this.moveOffset.bind(this);
  }

  private moveOffset(delta: number): number {
    if (this._offset + delta > this.length) throw new Error('Cannot exceed buffer length!');
    this._offset += delta;
    if (this._offset == this.length) this._isDone = true;
    return this._offset;
  }

  read<T, TReadArgs extends [...any[]]>(adapter: IBinaryAdapter<T, TReadArgs>, ...args: TReadArgs): T {
    return adapter.read(this.buffer, this._offset, this.moveOffset, ...args);
  }
}

export { BinaryReader };
