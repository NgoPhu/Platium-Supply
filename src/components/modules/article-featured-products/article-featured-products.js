import register from 'preact-custom-element'
import ProductCarousel from '../product-carousel/product-carousel'

function ArticleFeaturedProducts ({ title }) {
  return (
    <ProductCarousel title={title} products={window.articleFeaturedProducts} />
  )
}

register(ArticleFeaturedProducts, 'article-featured-products', ['title'])
