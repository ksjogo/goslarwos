import React, { useLayoutEffect } from 'react'
import { hydrate } from 'react-dom'
import App from './app'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles'
import { themeConfig } from './theme'
import { JssProvider } from 'react-jss'

// theme handling needs to be the same as SSR
const theme = createMuiTheme(themeConfig())
const generateClassName = createGenerateClassName()

// generic SSR hydration process
hydrate(<JssProvider generateClassName={generateClassName}>
  <MuiThemeProvider theme={theme}>
    <>
      <RemoveSSRCss />
      {/* take inital data from provided window variable */}
      <App INITIAL_DATA={(window as any).INITIAL_DATA} />
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
