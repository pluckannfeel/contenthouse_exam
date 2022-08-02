/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import { filter } from 'lodash'
import { sentenceCase } from 'change-case'
import { Link as RouterLink } from 'react-router-dom'

import { useSelector } from 'react-redux'
import {
  Avatar, Button, Card, Checkbox, Container, Stack,
  Table, TableRow, TableBody, TableCell, Typography, TableContainer, TablePagination,
} from '@mui/material'

import useReduxAction from '@hooks/useReduxAction'
import useSetState from '@hooks/useSetState'
import useUser from '@hooks/useUser'

import Iconify from '@components/Iconify'
import Label from '@components/Label'
import Page from '@components/Page'
import Scrollbar from '@components/Scrollbar'
import SearchNotFound from '@components/SearchNotFound'

import PageContext from '@contexts/pageContext'

import { UserListHead, UserListToolbar, UserMoreMenu } from './components'

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'verified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
]

function descendingComparator(a, b, orderBy){
  if (b[orderBy] < a[orderBy]){
    return -1
  }
  if (b[orderBy] > a[orderBy]){
    return 1
  }
  return 0
}

function getComparator(order, orderBy){
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function applySortFilter(array, comparator, query){
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  if (query){
    return filter(array, _user => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
  }
  return stabilizedThis.map(el => el[0])
}

const defaultState = {
  filterName: '',
  order: 'asc',
  orderBy: 'name',
  page: 0,
  rowsPerPage: 5,
  selected: [],
}

function Users(){
  const [state, setState] = useSetState(defaultState)
  const { filterName, order, orderBy, page, rowsPerPage, selected } = state

  useReduxAction('users', 'loadUsers', {}, [], {
    shouldPerformFn: (entityReducer) => {
      const { errors, loaded, loading } = entityReducer
      return !loaded && !loading && !errors.length
    },
  })

  const entities = useSelector(reduxState => reduxState.entities)
  const { users } = entities

  const {
    callbacks: {
      deleteUser: deleteFn,
    },
  } = useUser()

  const pageContext = {
    callbacks: {
      deleteUser: (user) => {
        deleteFn(user).then(({ success, errors }) => {
          if (!success && errors){
            console.log('failed')
          }
        })
      },
    },
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setState({
      order: isAsc ? 'desc' : 'asc',
      orderBy: property,
    })
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked){
      const newSelecteds = Object.values(users).map(n => n.name)
      setState({ selected: newSelecteds })
      return
    }
    setState({ selected: [] })
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []
    if (selectedIndex === -1){
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0){
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1){
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0){
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setState({ selected: newSelected })
  }

  const handleChangePage = (event, newPage) => {
    setState({ page: newPage })
  }

  const handleChangeRowsPerPage = (event) => {
    setState({
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10),
    })
  }

  const handleFilterByName = (event) => {
    setState({ filterName: event.target.value })
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Object.values(users).length) : 0

  const filteredUsers = applySortFilter(Object.values(users), getComparator(order, orderBy), filterName)

  const isUserNotFound = filteredUsers.length === 0

  return (
    <PageContext.Provider value={pageContext}>
      <Page title="Users">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              User
            </Typography>
            <Button variant="contained" component={RouterLink} to="/dashboard/users/new" startIcon={<Iconify icon="eva:plus-fill" />}>
              Create User
            </Button>
          </Stack>

          <Card>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={Object.values(users).length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, role, status, company, avatarUrl, verified } = row
                      const isItemSelected = selected.indexOf(name) !== -1

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} onChange={event => handleClick(event, name)} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={avatarUrl} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{company}</TableCell>
                          <TableCell align="left">{role}</TableCell>
                          <TableCell align="left">{verified ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={(status === 'banned' && 'error') || 'success'}>
                              {sentenceCase(status)}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <UserMoreMenu user={row} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={Object.values(users).length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </Page>
    </PageContext.Provider>
  )
}

export default Users
