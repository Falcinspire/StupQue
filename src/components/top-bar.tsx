import React, { useCallback } from 'react';
import { AppBar, Divider, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { Home } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1
  },
}));

/**
 * The menu bar at the top of the application. Contains a few navigation options.
 * 
 * @param props.title The title at the left side of the bar 
 * @param props.groupLink Either the link to the active group chat, or undefined to not show this part of the menu
 */
function TopBar(props: { title: string, groupLink?: string }) {
  const { title, groupLink } = props;
  
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton component={Link} to={'/'} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <Home />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={openMenu}>
          <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={closeMenu}
        >
          {
            groupLink ? (
              <>
                <MenuItem onClick={() => {
                  navigator.clipboard.writeText(groupLink).then(() => {
                    closeMenu();
                  });
                }}>Copy Group Link</MenuItem>
                <Divider />
              </>
            ) : (
              null
            )
          }
          <MenuItem component={Link} to={'/'} onClick={closeMenu}>Home</MenuItem>
          <MenuItem component={Link} to={'/about'} onClick={closeMenu}>About</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
