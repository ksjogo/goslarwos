import React, { useState, useLayoutEffect, useEffect } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import Emoji from 'react-emoji-render'
import { User } from '../db'
import _ from 'lodash'

// display a non-interactive list of all users
function Display ({ data }: { data: User[] }) {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Display Name</TableCell>
            <TableCell align="right">Status Text</TableCell>
            <TableCell align="right">Status Emoji</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.filter(row => !row.deleted).map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                <Avatar src={row.profile.image_72} />
                {row.name}
              </TableCell>
              <TableCell align="right">{row.profile.display_name}</TableCell>
              <TableCell align="right">{row.profile.status_text}</TableCell>
              <TableCell align="right">
                <Emoji text={row.profile.status_emoji} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default function App ({ INITIAL_DATA }: { INITIAL_DATA: User[] }) {
  // use provided values initally and then listen to websocket for updates
  const [state, setState] = useState(INITIAL_DATA)
  useEffect(() => {
    try {
      const path = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`
      const ws = new WebSocket(path)
      ws.onmessage = (event) => {
        const { user, status } = JSON.parse(event.data)
        if (status)
          console.log(status)
        if (user) {
          // upsert user
          const idx = _.findIndex(state, { id: user.id })
          if (idx !== -1)
            state[idx] = user
          else
            state.push(user)
          // setState uses shallow equality internally, need to overwrite
          setState(_.clone(state))
        }
      }
    } catch (e) {
      console.error(e)
    }
  })

  console.log(state)
  return <Display data={state} />
}
