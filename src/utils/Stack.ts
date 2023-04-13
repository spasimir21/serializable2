class Stack<T> {
  private readonly items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  peek(): T | null {
    return this.items[this.items.length - 1] ?? null;
  }

  pop(): T | null {
    return this.items.pop() ?? null;
  }
}

export { Stack };
