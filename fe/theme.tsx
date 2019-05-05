import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'

export function themeConfig (): ThemeOptions {
  return {
    palette: {
      primary: green,
      secondary: red,
      type: 'dark',
    },
  }
}
