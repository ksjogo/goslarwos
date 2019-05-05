import React from 'react'
import cheerio from 'cheerio'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { renderToString } from 'react-dom/server'
import { SheetsRegistry } from 'jss'
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles'

import App from './fe/app'
import { themeConfig } from './fe/theme'
import { JssProvider } from 'react-jss'

const templateContent = readFileSync(resolve('static', 'index.html'))

// pretty standard SSR with material-ui and cheerio
export default function render (data: any) {
  const sheetsRegistry = new SheetsRegistry()
  const sheetsManager = new Map()
  const theme = createMuiTheme(themeConfig())
  const generateClassName = createGenerateClassName()

  const template = cheerio.load(templateContent)
  const rendered = renderToString(
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
        <App INITIAL_DATA={data} />
      </MuiThemeProvider>
    </JssProvider>
  )
  const css = sheetsRegistry.toString()
  template('#root').append(rendered)
  template('#jss').append(css)
  template('#data').append(`window.INITIAL_DATA = ${JSON.stringify(data)};`)

  return template.html()
}
