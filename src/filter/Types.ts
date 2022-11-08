import { DateTime } from "luxon";

export interface Filter {
  datapointId: string[];
  controlId: string[];
  from: DateTime;
  to: DateTime;
}
