import { Checkbox, FormControlLabel, Menu, MenuItem } from "@mui/material";
import { UniqueDatapoint } from "jm-castle-ac-dc-types/dist/All.mjs";
import { useCallback } from "react";

export type DatapointSelection = {
  datapoint: UniqueDatapoint;
  selected: boolean;
}[];

export interface DatapointSelectionMenuProps {
  selection: DatapointSelection | undefined;
  anchorEl: Element | null;
  onChange: (newSelection: DatapointSelection) => void;
  onClose: () => void;
}

export const DatapointSelectionMenu = (props: DatapointSelectionMenuProps) => {
  const { selection, onChange, anchorEl, onClose } = props;
  const isMenuOpen = !!selection && !!selection.length && Boolean(anchorEl);
  const handleDatapointSelection = useCallback(
    (datapointId: string, selected: boolean) => {
      const newSelection = selection
        ? selection.map((sel) =>
            sel.datapoint.id === datapointId ? { ...sel, selected } : { ...sel }
          )
        : [];
      onChange(newSelection);
    },
    [selection, onChange]
  );

  return (
    <>
      <Menu open={isMenuOpen} onClose={onClose} anchorEl={anchorEl}>
        {selection &&
          selection
            .sort((a, b) => a.datapoint.name.localeCompare(b.datapoint.name))
            .map((sel) => (
              <MenuItem key={sel.datapoint.id}>
                <FormControlLabel
                  label={`${sel.datapoint.name}${
                    sel.datapoint.valueUnit
                      ? " (" + sel.datapoint.valueUnit + ")"
                      : ""
                  }`}
                  control={
                    <Checkbox
                      onChange={(event, checked) =>
                        handleDatapointSelection(sel.datapoint.id, checked)
                      }
                      checked={sel.selected}
                    />
                  }
                ></FormControlLabel>
              </MenuItem>
            ))}
      </Menu>
    </>
  );
};
