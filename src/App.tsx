import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/features/home/HomePage'
import { ForSalePage } from '@/features/for-sale/ForSalePage'
import { InformationPage } from '@/features/information/InformationPage'
import { GoldCalculatorPage } from '@/features/gold-calculator/GoldCalculatorPage'
import { NotFoundPage } from '@/features/not-found/NotFoundPage'
import { WebsitesPage } from '@/features/websites/WebsitesPage'
import { ReviewPage } from '@/features/reviews/ReviewPage'
import { TradesPage } from '@/features/trades/TradesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="for-sale" element={<ForSalePage />} />
          <Route path="gold-calculator" element={<GoldCalculatorPage />} />
          <Route path="information" element={<InformationPage />} />
          <Route path="websites" element={<WebsitesPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="trades" element={<TradesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
