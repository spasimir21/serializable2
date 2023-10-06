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

  replaceTop(item: T): void {
    this.items[this.items.length - 1] = item;
  }
}

export { Stack };
