export abstract class TaggedError<TTag extends string = string> extends Error {
  public abstract readonly _tag: TTag;
}

export class ParseError extends TaggedError {
  public readonly _tag = 'parse-error' as const;
  constructor(public issues: any[]) {
    super('parse-error');
  }
}

export class InvalidResponseError extends TaggedError {
  public readonly _tag = 'invalid-response-error' as const;
  constructor(public res: Response) {
    super('invalid-response-error');
  }
}

export class UnknownError extends TaggedError {
  public readonly _tag = 'unknown-error' as const;
  constructor(cause: Error) {
    super('unknown-error');
    this.cause = cause;
  }
}
