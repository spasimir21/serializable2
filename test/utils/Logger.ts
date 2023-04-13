const stripColorsFromString = (string: string) => string.replace(/\u001b[^m]*?m/g, '');

class Logger {
  public readonly logs: string[] = [];

  log(message: string) {
    this.logs.push(message);
    console.log(message);
  }

  export(seperator: string = '\n', stripColors: boolean = true): string {
    let text = this.logs.join(seperator);
    if (stripColors) text = stripColorsFromString(text);
    return text;
  }
}

export { Logger };
