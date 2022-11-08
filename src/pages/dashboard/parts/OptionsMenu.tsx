import { Checkbox, FormControlLabel, Menu, MenuItem } from "@mui/material";
import { useCallback } from "react";
import { PageOptions } from "./OptionsComponent";

export interface OptionsMenuProps {
  options: PageOptions;
  anchorEl: Element | null;
  onChange: (newOptions: Partial<PageOptions>) => void;
  onClose: () => void;
}

export const OptionsMenu = (props: OptionsMenuProps) => {
  const { options, onChange, anchorEl, onClose } = props;
  const {
    isDevicesVisible,
    isEnginesVisible,
    isControlHistoryVisible,
    isControlPanelVisible,
    isDatastateVisible,
  } = options;
  const isMenuOpen = Boolean(anchorEl);
  const handleNewOptions = useCallback(
    (newOptions: Partial<PageOptions>) => {
      onChange(newOptions);
    },
    [onChange]
  );

  return (
    <>
      <Menu open={isMenuOpen} onClose={onClose} anchorEl={anchorEl}>
        <MenuItem>
          <FormControlLabel
            label={"Devices"}
            control={
              <Checkbox
                onChange={(event, checked) =>
                  handleNewOptions({ isDevicesVisible: checked })
                }
                checked={isDevicesVisible}
              />
            }
          ></FormControlLabel>
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label={"Engines"}
            control={
              <Checkbox
                onChange={(event, checked) =>
                  handleNewOptions({ isEnginesVisible: checked })
                }
                checked={isEnginesVisible}
              />
            }
          ></FormControlLabel>
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label={"Control panel"}
            control={
              <Checkbox
                onChange={(event, checked) =>
                  handleNewOptions({ isControlPanelVisible: checked })
                }
                checked={isControlPanelVisible}
              />
            }
          ></FormControlLabel>
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label={"Control history"}
            control={
              <Checkbox
                onChange={(event, checked) =>
                  handleNewOptions({ isControlHistoryVisible: checked })
                }
                checked={isControlHistoryVisible}
              />
            }
          ></FormControlLabel>
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label={"Datastate"}
            control={
              <Checkbox
                onChange={(event, checked) =>
                  handleNewOptions({ isDatastateVisible: checked })
                }
                checked={isDatastateVisible}
              />
            }
          ></FormControlLabel>
        </MenuItem>
      </Menu>
    </>
  );
};
