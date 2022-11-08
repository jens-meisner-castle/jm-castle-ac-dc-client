export interface DatapointStateRow {
  datapointId: string;
  at: Date;
  atMs: number;
  loggedAt: Date;
  loggedAtMs: number;
  valueDisplay: string;
  executed?: boolean;
  success?: boolean;
}
