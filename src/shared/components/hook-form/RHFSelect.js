import React from 'react'
import PropTypes from 'prop-types'

import { useFormContext, Controller } from 'react-hook-form'

import { InputLabel, FormControl, Select, MenuItem } from '@mui/material'

export default function RHFSelect({ name, options, ...other }){
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth>
          <InputLabel id="select-label">{other.label}</InputLabel>
          <Select
            {...field}
            labelId="select-label"
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            error={!!error}
            {...other}
          >
            {options.map(option => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  )
}

RHFSelect.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
}
