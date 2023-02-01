import { createBrowserRouter } from 'react-router-dom'
import Layout from './layout'
import Error from './components/Error'
import Home from './pages/home'
import Record from './pages/record'
import Stream from './pages/stream'
import Live from './pages/live'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: 'record',
        element: <Record />,
        errorElement: <Error />,
      },
      {
        path: 'stream',
        element: <Stream />,
        errorElement: <Error />,
      },
      {
        path: 'live',
        element: <Live />,
        errorElement: <Error />,
      },
    ],
  },
])

export default router
