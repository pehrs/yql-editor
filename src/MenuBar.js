import {
  AppBar, Avatar, Box, Button, Container, FormControlLabel, FormGroup,
  IconButton, Menu, MenuItem, Switch, Toolbar, Tooltip, Typography
} from "@mui/material";
import React, { useCallback, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from "@mui/icons-material";
const { ipcRenderer } = window.require('electron');

function MenuBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [queryAnchorEl, setQueryAnchorEl] = React.useState(null);

  const execCallback = props.executeCallback
  const formatCallback = props.formatCallback

  const handleChange = (event) => {
    // setAuth(event.target.checked);
  };

  const handleFileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleQueryMenu = (event) => {
    setQueryAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
    setQueryAnchorEl(null);
  };

  const handleQuit = () => {
    handleClose()
    ipcRenderer.send('close', [])
  };

  const handleReload = () => {
    handleClose()
    ipcRenderer.send('reload', [])
  };


  const handleOpen = () => {
    handleClose()
    ipcRenderer.send('open-file', [])
  };

  const handleExecute = () => {
    handleClose()
    execCallback()
  }

  const handleFormat = () => {
    handleClose()
    formatCallback()
  }


  // ---------------------------------
  // Keyboard short cut handling
  var ctrl = false;
  var alt = false;
  var shift = false;
  const handleKeyDown = useCallback((event) => {
    // console.log(`Key down: ${event.key} ctrl:${ctrl}`);
    switch (event.key) {
      case "Control":
        ctrl = true;
        break;
      case "Alt":
        alt = true;
        break;
      case "Shift":
        shift = true;
        break;
      case 'o':
        if (ctrl) {
          ipcRenderer.send('open-file', [])
        }
        break;
      case 'i':
        if (ctrl && shift) {
          handleFormat();
        }
        break;
      case 'q':
        if (ctrl) {
          ipcRenderer.send('close', [])
        }
        break;
      case 'r':
        if (ctrl) {
          ipcRenderer.send('reload', [])
        }
        break;
      case 'Enter':
        // This only works outside the Monaco-Editor
        // There is a special override in the app.jsx for this :-)
        if (ctrl) {
          handleExecute();
        }
        break;
      case 'F12':
        ipcRenderer.send('open-web-tools', [])
        break;
    }
  }, []);
  const handleKeyUp = useCallback((event) => {
    // console.log(`Key up: ${event.key} ctrl:${ctrl}`);
    switch (event.key) {
      case "Control":
        ctrl = false;
        break;
      case "Alt":
        alt = false;
        break;
      case "Shift":
        shift = false;
        break;

    }
  }, []);
  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
  //-------------------------------------------------



  return <div className="menu-bar">
    <span>
      <Button
        size="small"
        aria-label="File menu"
        aria-controls="menu-file"
        aria-haspopup="true"
        onClick={handleFileMenu}
        color="inherit"
      >
        File
      </Button>
      <Menu
        id="menu-file"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpen}>
          <div className="menu-item">
            <span className="menu-item-label">Open</span>
            <span className="menu-item-shortcut">Ctrl+O</span>
          </div>
        </MenuItem>
        <MenuItem onClick={handleReload}>
          <div className="menu-item">
            <span className="menu-item-label">Reload</span>
            <span className="menu-item-shortcut">Ctrl+R</span>
          </div>
        </MenuItem>
        <MenuItem onClick={handleQuit}>
          <div className="menu-item">
            <span className="menu-item-label">Quit</span>
            <span className="menu-item-shortcut">Ctrl+Q</span>
          </div>
        </MenuItem>
      </Menu>
    </span>
    <span>
      <Button
        size="small"
        aria-label="Query Menu"
        aria-controls="menu-query"
        aria-haspopup="true"
        onClick={handleQueryMenu}
        color="inherit"
      >
        Query
      </Button>
      <Menu
        id="menu-query"
        anchorEl={queryAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(queryAnchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleFormat}>
          <div className="menu-item">
            <span className="menu-item-label">Format</span>
            <span className="menu-item-shortcut">Ctrl+I</span>
          </div>
        </MenuItem>
        <MenuItem onClick={handleExecute}>
          <div className="menu-item">
            <span className="menu-item-label">Execute</span>
            <span className="menu-item-shortcut">Ctrl+Enter</span>
          </div>
        </MenuItem>
      </Menu>
    </span>
  </div>
    ;
}

export default MenuBar;