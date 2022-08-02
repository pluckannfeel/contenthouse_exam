import React, { useContext, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Menu, MenuItem, IconButton, ListItemIcon, ListItemText,
} from '@mui/material'

import useSetState from '@hooks/useSetState'

import Iconify from '@components/Iconify'

import PageContext from '@contexts/pageContext'

const defaultState = {
  showDialog: false,
  shoMenu: false,
}

export default function UserMoreMenu(props){
  const { user } = props

  const [state, setState] = useSetState(defaultState)
  const { showDialog, showMenu } = state

  const ref = useRef(null)

  const { callbacks: { deleteUser } } = useContext(PageContext)

  return (
    <>
      <IconButton ref={ref} onClick={() => setState({ showMenu: !showMenu })}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Dialog
        open={showDialog || false}
        onClose={() => setState({ showDialog: !showDialog })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete User
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setState({ showDialog: !showDialog })}>Cancel</Button>
          <Button onClick={() => deleteUser(user)} autoFocus variant="contained" color="primary">
            Yes, delete it.
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        open={showMenu || false}
        anchorEl={ref.current}
        onClose={() => setState({ showMenu: !showMenu })}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => setState({ showDialog: true, showMenu: false })}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`/dashboard/users/${user.id}`} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  )
}

UserMoreMenu.propTypes = {
  user: PropTypes.object,
}
