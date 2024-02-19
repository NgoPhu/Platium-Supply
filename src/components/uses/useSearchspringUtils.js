const QUERY_MAPPING = {
  search: {
    code: 'q',
    param: 'searchQuery',
    path: 'search'
  },
  origin: {
    code: 'oq',
    param: 'originalQuery',
    path: 'search'
  },
  filter: {
    code: 'filter.',
    param: 'filter.'
  },
  sort: {
    code: 'sort',
    param: 'sort'
  },
  page: {
    code: 'page',
    param: 'page'
  },
  price: {
    code: 'ss_price',
    param: 'ss_price',
    high: 'high',
    low: 'low'
  },
  perPage: {
    code: 'resultsPerPage',
    param: 'perPage'
  },
  results: {
    code: 'results',
    param: 'results'
  },
  tag: {
    code: 'tag',
    param: 'tag'
  },
  separate: {
    code: '.'
  }
}

const AVAILABLE_FILTER_OPTIONS = [
  {
    key: 'tags_occasion',
    name: 'Occasion'
  },
  {
    key: 'product_type',
    name: 'Product Type'
  },
  {
    key: 'collection_name',
    name: 'Category'
  },
  {
    key: 'tags_range',
    name: 'Range'
  },
  {
    key: 'ss_label',
    name: 'Label'
  },
  {
    key: 'vendor',
    name: 'Brand'
  },
  {
    key: 'tags_size',
    name: 'Size'
  },
  {
    key: 'tags_page_layout',
    name: 'Layout'
  },
  {
    key: 'tags_pen_tip_nib',
    name: 'Nib'
  },
  {
    key: 'tags_paper_weight',
    name: 'Paper Weight'
  },
  {
    key: 'tags_cover_type',
    name: 'Cover Type'
  },
  {
    key: 'ss_price',
    name: 'Price'
  },
  {
    key: 'tags_descriptive_colour',
    name: 'Colour'
  }
]

const groupParamsByKey = (params) => {
  const selectedObject = Object.create({})
  const selectedDefault = {}
  const paramsObject = [...params.entries()].reduce((selected, item) => {
    const [key, value] = item
    if (key === QUERY_MAPPING.search.code) {
      selected[QUERY_MAPPING.search.param] = value
    } else if (key === QUERY_MAPPING.origin.code) {
      selected[QUERY_MAPPING.origin.param] = value
    } else if (key.includes(QUERY_MAPPING.filter.code)) {
      if (key.includes(`${QUERY_MAPPING.price.code}${QUERY_MAPPING.separate.code}${QUERY_MAPPING.price.low}`)) {
        selectedObject[QUERY_MAPPING.price.code] = [parseInt(value)]
      } else if (key.includes(`${QUERY_MAPPING.price.code}${QUERY_MAPPING.separate.code}${QUERY_MAPPING.price.high}`)) {
        selectedObject[QUERY_MAPPING.price.code].push(parseInt(value))
      } else {
        const keyString = key.split(QUERY_MAPPING.separate.code)[1]
        if (!Object.prototype.hasOwnProperty.call(selectedObject, keyString)) {
          selectedObject[keyString] = [value]
        } else {
          selectedObject[keyString].push(value)
        }
      }
    } else if (key.includes(QUERY_MAPPING.sort.code)) {
      selected[key.split(QUERY_MAPPING.separate.code)[0]] = {
        direction: key.split(QUERY_MAPPING.separate.code)[1],
        field: value
      }
    } else if (key.includes(QUERY_MAPPING.page.code)) {
      selected[key] = parseInt(value)
    } else if (key.includes(QUERY_MAPPING.perPage.code)) {
      selected[QUERY_MAPPING.perPage.param] = parseInt(value)
    } else if (key.includes(QUERY_MAPPING.tag.code)) {
      selected[QUERY_MAPPING.tag.param] = value
    } else if (key === QUERY_MAPPING.results.code) {
      selected[QUERY_MAPPING.results.param] = value
    }

    return selected
  }, selectedDefault)

  return {
    ...paramsObject,
    selectedValues: {
      ...selectedObject
    }
  }
}

function getAvailable(value) {
  return value === '1'
}

function getVariants(values) {
  let data = []
  if (values) {
    const variants = JSON.parse(values.replace(/&quot;/g, '"'))
    data = variants.map((variant) => {
      return {
        ...variant,
        available: !(variant.inventory_management === 'shopify' && variant.inventory_policy === 'deny' && variant.inventory_quantity <= 0),
        options: [variant.option1, variant.option2, variant.option3]
      }
    })
  }
  return data
}

function getOptions(values) {
  let data = []
  if (values) {
    const options = JSON.parse(values.replace(/&quot;/g, '"'))
    data = options.map((option) => option.name)
  }
  return data
}

function getTags(tags) {
  if (!tags) {
    return []
  }
  if (tags instanceof Array) {
    return tags
  }
  return tags.split(',').map((item) => item.trim())
}

function getPrice(price) {
  return price ? convertPrice(price) * 100 : 0
}

function convertPrice(price) {
  return typeof price === 'string' ? parseFloat(price) : price
}

function getImage(imageUrl) {
  return imageUrl
}

function getImages(...attrs) {
  return attrs.filter((item) => item)
}

function checkItemInCart(id) {
  const results = window.GM_STATE.cart.initCart.items.length > 0 && window.GM_STATE.cart.initCart.items.some((item) => item.product_id === parseFloat(id))
  return results
}

function redirect(path, handle, ctrlKey = false) {
  const newUrl = `${window.location.origin}/${path}/${handle}`
  if (ctrlKey) {
    window.open(newUrl, '_blank').focus()
    return
  }
  window.location = newUrl
}

function getCartSkus(items) {
  return items
    .map((item) => item && item.sku)
    .filter((item) => item)
    .toString()
}

const getSelectedValues = (values, propertyName) => {
  const arrs = []

  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      if (key !== propertyName) {
        const group = values[key]
        if (group.length) {
          for (const item of group) {
            arrs.push({
              value: item,
              key
            })
          }
        }
      } else {
        arrs.push({
          value: values[key],
          key
        })
      }
    }
  }

  return arrs
}

export {
  QUERY_MAPPING,
  AVAILABLE_FILTER_OPTIONS,
  groupParamsByKey,
  getAvailable,
  getVariants,
  getOptions,
  getTags,
  getPrice,
  getImage,
  getImages,
  checkItemInCart,
  redirect,
  getCartSkus,
  getSelectedValues
}
