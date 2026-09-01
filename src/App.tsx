import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import Range from './pages/Range'
import Category from './pages/Category'
import Product from './pages/Product'
import Downloads from './pages/Downloads'
import Crossovers from './pages/Crossovers'
import CrossoverDetail from './pages/CrossoverDetail'
import Support from './pages/Support'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/range" element={<Range />} />
        <Route path="products/:categorySlug" element={<Category />} />
        <Route path="products/:categorySlug/:productSlug" element={<Product />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="crossovers" element={<Crossovers />} />
        <Route path="crossovers/:slug" element={<CrossoverDetail />} />
        <Route path="support" element={<Support />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
