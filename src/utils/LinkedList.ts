interface ILinkedListNode<TNode extends ILinkedListNode<TNode>> {
  next: TNode | null;
}

class LinkedList<TNode extends ILinkedListNode<TNode>> {
  private _start: TNode | null = null;
  private _tail: TNode | null = null;
  private _length: number = 0;

  get start(): TNode | null {
    return this._start;
  }

  get tail(): TNode | null {
    return this._tail;
  }

  get length(): number {
    return this._length;
  }

  push(node: TNode): TNode {
    if (this._tail != null) this._tail.next = node;
    if (this._length == 0) this._start = node;
    this._tail = node;
    this._length++;
    return node;
  }
}

export { LinkedList, ILinkedListNode };
