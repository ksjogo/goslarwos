import React from 'react'
import cheerio from 'cheerio'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { renderToString } from 'react-dom/server'
import { SheetsRegistry } from 'jss'
import JssProvider from 'react-jss/lib/JssProvider'
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles'

import App from './fe/app'
import { themeConfig } from './fe/theme'

const templateContent = readFileSync(resolve('static', 'index.html'))

export default function render () {
  const sheetsRegistry = new SheetsRegistry()
  const sheetsManager = new Map()
  const theme = createMuiTheme(themeConfig())
  const generateClassName = createGenerateClassName()

  const template = cheerio.load(templateContent)
  const rendered = renderToString(
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
        <App />
      </MuiThemeProvider>
    </JssProvider>
  )
  const css = sheetsRegistry.toString()
  template('#root').append(rendered)
  template('#jss').append(css)
  return template.html()
}
