import { formatMoney as shopifyFormatMoney } from '@shopify/theme-currency'
const settings = window.GM_STATE
const customBadgeTags = settings?.customs?.badge.tags || []
const customBadgeItems = settings?.customs?.badge.items || []

const formatMoney = function (cents, format = settings.shopify.moneyFormat) {
  return shopifyFormatMoney(cents, format)
}

const getProductTitle = (title) => {
  return title
}

const getProductSubtitle = (title) => {
  const textareaEl = document.createElement('textarea')
  textareaEl.innerHTML = title && title.includes('|') ? title.split(' | ')[1] : ''
  return textareaEl.value
}

const getCustomBadgeClass = (tagName) => {
  let tagClass = ''
  if (['new'].includes(tagName)) {
    tagClass = 'badge'
  }
  return tagClass
}

const getBadges = (tags) => {
  const items = []

  if (tags.length) {
    for (const tag of tags) {
      const index = customBadgeTags.findIndex((i) => tag === i)
      if (index !== -1) {
        items.push(customBadgeItems[index])
      } else {
        if (tag.includes('label-')) {
          const tagName = tag.replace('label-', '')
          items.push({
            text: tagName,
            tag,
            customClass: getCustomBadgeClass(tagName),
            backgroundColor: '',
            textColor: ''
          })
        }
      }
    }
  }

  return items
}

const getPriceSubscription = (planGroups, price) => {
  const planGroup = planGroups?.find(Boolean)
  const sellingPlans = planGroup?.selling_plans
  const priceAdjustments = sellingPlans?.find(Boolean).price_adjustments
  const priceAdjustment = priceAdjustments?.find(Boolean)
  let priceSubscription = price
  if (priceAdjustment?.value > 0) {
    if (priceAdjustment.value_type === 'percentage') {
      priceSubscription = priceSubscription - priceSubscription * priceAdjustment.value / 100
    } else {
      priceSubscription = priceSubscription - priceAdjustment.value
    }
  }
  return priceSubscription
}

const getSubscriptionSave = (planGroups) => {
  const planGroup = planGroups?.find(Boolean)
  const sellingPlans = planGroup?.selling_plans
  const priceAdjustments = sellingPlans?.find(Boolean).price_adjustments
  const priceAdjustment = priceAdjustments?.find(Boolean)
  let subscriptionSave = null
  if (priceAdjustment?.value > 0) {
    if (priceAdjustment.value_type === 'percentage') {
      subscriptionSave = `${priceAdjustment.value}%`
    } else {
      subscriptionSave = `${formatMoney(priceAdjustment.value)}`
    }
  }
  return subscriptionSave && `Subscribe & Save ${subscriptionSave}`
}

const addBadgeSale = (badges, price, originalPrice) => {
  if (price && originalPrice && price < originalPrice) {
    const salePrice = originalPrice - price
    const text = `Save ${formatMoney(salePrice)}`
    badges.unshift({
      text,
      tag: 'label-sale',
      customClass: 'badge-card-sale',
      backgroundColor: '',
      textColor: ''
    })
  }
  return badges
}

export {
  formatMoney,
  getProductTitle,
  getProductSubtitle,
  getBadges,
  getCustomBadgeClass,
  getPriceSubscription,
  getSubscriptionSave,
  addBadgeSale
}
