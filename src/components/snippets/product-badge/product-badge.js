import { useEffect, useState } from 'preact/hooks'
import { getBadges } from 'uses/useShopify'
import Badge from 'snippets/badge/badge'

function ProductBadge({ target = '' }) {
  const [badge, setBadge] = useState([])

  useEffect(() => {
    if (target) {
      const currentTags = window[target]
      if (currentTags.length) {
        const badge = getBadges(currentTags)
        setBadge(badge)
      }
    }
  }, [])

  return badge.length > 0 && <Badge items={badge} className="flex gap-2" />
}

export default ProductBadge
