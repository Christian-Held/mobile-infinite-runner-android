declare module 'pg' {
  export interface QueryResult<T = any> {
    rows: T[];
    rowCount: number;
  }

  export interface PoolConfig {
    connectionString: string;
  }

  export interface PoolClient {
    query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    release(): void;
  }

  export class Pool {
    constructor(config: PoolConfig);
    query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    connect(): Promise<PoolClient>;
    end(): Promise<void>;
    on(event: 'error', listener: (err: Error) => void): this;
  }
}

declare module 'bcryptjs';
