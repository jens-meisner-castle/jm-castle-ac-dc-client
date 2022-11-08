import { DateTime } from "luxon";
import { Filter } from "../filter/Types";

export const initialFrom = () => DateTime.now().minus({ hours: 1 });
export const initialTo = () => DateTime.now().plus({ minutes: 15 });

export const getNewFilter = (
  previous?: Filter,
  newFrom?: DateTime,
  newTo?: DateTime,
  newDatapointId?: string[],
  newControlId?: string[]
): Filter => {
  const {
    from: previousFrom,
    to: previousTo,
    datapointId: previousDatapointId,
    controlId: previousControlId,
  } = previous || {};
  const from = newFrom || previousFrom || initialFrom();
  const to = newTo || previousTo || initialTo();
  const datapointId = newDatapointId || previousDatapointId || [];
  const controlId = newControlId || previousControlId || [];
  if (to.diff(from).milliseconds > 0) {
    // fine
    return { datapointId, from, to, controlId };
  } else {
    return newFrom
      ? {
          datapointId,
          controlId,
          from,
          to: from,
        }
      : { datapointId, from: to, to, controlId };
  }
};

export const getSecondsInterval_logged_at = (from: DateTime, to: DateTime) => {
  return {
    logged_at_from: Math.floor(from.toMillis() / 1000),
    logged_at_to: Math.floor(to.toMillis() / 1000),
  };
};
