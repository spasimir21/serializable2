import { ILinkedListNode, LinkedList } from '../utils/LinkedList';
import { IBinaryAdapter } from './IBinaryAdapter';

interface IBinaryWriteNode<T> extends ILinkedListNode<IBinaryWriteNode<T>> {
  adapter: IBinaryAdapter<T, any>;
  value: T;
  size: number;
}

class BinaryWriter {
  private nodes: LinkedList<IBinaryWriteNode<any>> = new LinkedList();
  private _length: number = 0;

  get length(): number {
    return this._length;
  }

  write<T>(adapter: IBinaryAdapter<T, any>, value: T): void {
    const size = adapter.size(value);

    this.nodes.push({
      adapter,
      value,
      size,
      next: null
    });

    this._length += size;
  }

  toBuffer(): Buffer {
    const buffer = Buffer.allocUnsafe(this._length);

    let node = this.nodes.start;
    let offset = 0;

    while (node != null) {
      node.adapter.write(node.value, buffer, offset);
      offset += node.size;
      node = node.next;
    }

    return buffer;
  }
}

export { BinaryWriter };
