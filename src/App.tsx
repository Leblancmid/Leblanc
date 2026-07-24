import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/features/home/HomePage'
import { ForSalePage } from '@/features/for-sale/ForSalePage'
import { InformationPage } from '@/features/information/InformationPage'
import { ServerPage } from '@/features/server/ServerPage'
import { NotFoundPage } from '@/features/not-found/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="for-sale" element={<ForSalePage />} />
          <Route path="information" element={<InformationPage />} />
          <Route path="server" element={<ServerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
