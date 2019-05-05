import React, { useLayoutEffect } from 'react'
import { hydrate } from 'react-dom'
import App from './app'
import JssProvider from 'react-jss/lib/JssProvider'
import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles'
import { themeConfig } from './theme'

const theme = createMuiTheme(themeConfig())
const generateClassName = createGenerateClassName()

hydrate(<JssProvider generateClassName={generateClassName}>
  <MuiThemeProvider theme={theme}>
        <>
            <RemoveSSRCss />
            <App />
        </>
  </MuiThemeProvider>
</JssProvider>, document.getElementById('root'))

function RemoveSSRCss () {
  useLayoutEffect(() => {
    const jssStyles = document.getElementById('jss')
    if (jssStyles && jssStyles.parentNode)
      jssStyles.parentNode.removeChild(jssStyles)
  }, [])
  return null
}
