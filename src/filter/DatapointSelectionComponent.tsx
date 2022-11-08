import { Button, Grid } from "@mui/material";
import { MouseEventHandler, useState } from "react";
import {
  DatapointSelection,
  DatapointSelectionMenu,
} from "./DatapointSelectionMenu";

export interface DatapointSelectionComponentProps {
  selection: DatapointSelection;
  onChange: (newSelection: DatapointSelection) => void;
}

export const DatapointSelectionComponent = (
  props: DatapointSelectionComponentProps
) => {
  const { selection, onChange } = props;
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const isMenuOpen = !!selection.length && Boolean(menuAnchorEl);
  const openMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      {isMenuOpen && (
        <DatapointSelectionMenu
          selection={selection}
          onChange={onChange}
          onClose={handleMenuClose}
          anchorEl={menuAnchorEl}
        />
      )}
      {selection.length && (
        <Grid container direction="row" alignContent={"center"}>
          <Grid item>
            <Button variant="contained" onClick={openMenu}>
              {"Datapoints"}
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};
