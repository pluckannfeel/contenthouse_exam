import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import * as Yup from 'yup'

import { styled } from '@mui/material/styles'
import {
  Card, Container, Stack, Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Page from '@components/Page'
import {
  FormProvider, RHFCheckbox, RHFTextField, RHFSelect,
} from '@components/hook-form'

import useUser from '@hooks/useUser'

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(3, 0),
}))

function User(props){
  const { isNew } = props
  const navigate = useNavigate()

  const { userId } = useParams()

  const {
    callbacks: {
      createUser: createFn,
      updateUser: updateFn,
    },
    user,
  } = useUser({ id: userId })

  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Name required'),
    company: Yup.string().required('Company required'),
    role: Yup.string().required('Role'),
    verified: Yup.bool().required('Required'),
    status: Yup.string().required('Status is required'),
  })

  const defaultValues = {
    name: '',
    company: '',
    role: '',
    verified: false,
    status: '',
  }

  const statuses = [
    { label: 'Active', value: 'active' },
    { label: 'Banned', value: 'banned' },
  ]

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues: { ...defaultValues, ...user },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (data) => {
    if (isNew){
      createFn(data).then(({ success, errors }) => {
        if (!success && errors){
          console.log('failed')
          return
        }

        navigate('/dashboard/users', { replace: true })
      })
    } else {
      updateFn(data).then(({ success, errors }) => {
        if (!success && errors){
          console.log('failed')
          return
        }

        navigate('/dashboard/users', { replace: true })
      })
    }
  }

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {isNew ? 'Create' : 'Update'} User
          </Typography>
        </Stack>
        <Card>
          <Container>
            <ContentStyle>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <RHFTextField name="name" label="Name" />
                  <RHFTextField name="company" label="Company" />
                  <RHFTextField name="role" label="Role" />
                  <Stack direction="row" spacing={2}>
                    <RHFSelect name="status" label="Status" options={statuses} />
                    <RHFCheckbox name="verified" label="Verified" />
                  </Stack>
                  <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    {isNew ? 'Create' : 'Update'}
                  </LoadingButton>
                </Stack>
              </FormProvider>
            </ContentStyle>
          </Container>
        </Card>
      </Container>
    </Page>
  )
}

User.propTypes = {
  isNew: PropTypes.bool,
}

export default User
