import { Row_AnyLog } from "jm-castle-ac-dc-types/build";
import { DurationUnit, DurationUnits } from "jm-castle-types/build";
import { Duration } from "luxon";

export const calculateIntegral = (rows: Row_AnyLog[], durationUnit: DurationUnit) => {

if (rows.length < 2) {
  return 0;
}
let sum = 0;
for (let i = 1; i < rows.length - 1; i++) {
  const previous = rows[i - 1];
  const current = rows[i];
  const y = typeof current.value_num === "number" && typeof previous.value_num === "number" ? (current.value_num + previous.value_num) / 2 : 0;
  const dx = (current.logged_at * 1000) + current.logged_at_ms - (previous.logged_at * 1000) + previous.logged_at_ms;
  sum = sum + dx * y;
}
return Duration.fromMillis(sum).as(DurationUnits[durationUnit].luxonKey);}