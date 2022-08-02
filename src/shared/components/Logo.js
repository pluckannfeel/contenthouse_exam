import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'

import { Box } from '@mui/material'

export default function Logo(props){
  const { disabledLink = false, sx } = props
  const logo = <Box component="img" src="/static/logo.svg" sx={{ width: 40, height: 40, ...sx }} />

  if (disabledLink){
    return logo
  }

  return <RouterLink to="/">{logo}</RouterLink>
}

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
}
