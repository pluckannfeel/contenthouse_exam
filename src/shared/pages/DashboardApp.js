import React from 'react'

import { styled } from '@mui/material/styles'
import { Card, Container, Stack, Typography } from '@mui/material'

import Page from '../components/Page'

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  flexDirection: 'column',
  padding: theme.spacing(2, 0),
}))

export default function DashboardApp(){
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome!
        </Typography>
        <Card>
          <Container>
            <ContentStyle>
              <Stack spacing={{ xs: 0.5, sm: 1.5 }}>
                <Typography variant="h6">
                  Content House Exam
                </Typography>
                <Typography variant="body 2">
                  Please see the readme for the exam instructions...
                </Typography>
              </Stack>
            </ContentStyle>
          </Container>
        </Card>
      </Container>
    </Page>
  )
}
