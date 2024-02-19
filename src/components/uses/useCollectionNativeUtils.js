const QUERY_MAPPING = {
  search: {
    code: 'q',
    param: 'searchQuery',
    path: 'search'
  },
  filter: {
    code: 'filter.',
    param: 'filter.'
  },
  sort: {
    code: 'sort_by',
    param: 'sort_by'
  },
  page: {
    code: 'page',
    param: 'page'
  },
  price: {
    code: 'v.price',
    param: 'v.price',
    high: 'lte',
    low: 'gte'
  },
  separate: {
    code: '.'
  }
}

const groupParamsByKey = (params) => {
  const selectedObject = Object.create({})
  const selectedDefault = {}
  const paramsObject = [...params.entries()].reduce((selected, item) => {
    const [key, value] = item
    if (key === QUERY_MAPPING.search.code) {
      selected[QUERY_MAPPING.search.param] = value
    } else if (key.includes(QUERY_MAPPING.filter.code)) {
      if (key.includes(`${QUERY_MAPPING.price.code}${QUERY_MAPPING.separate.code}${QUERY_MAPPING.price.low}`)) {
        selectedObject[`${QUERY_MAPPING.filter.code}${QUERY_MAPPING.price.code}`] = [parseInt(value)]
      } else if (key.includes(`${QUERY_MAPPING.price.code}${QUERY_MAPPING.separate.code}${QUERY_MAPPING.price.high}`)) {
        selectedObject[`${QUERY_MAPPING.filter.code}${QUERY_MAPPING.price.code}`].push(parseInt(value))
      } else {
        if (!Object.prototype.hasOwnProperty.call(selectedObject, key)) {
          selectedObject[key] = [value]
        } else {
          selectedObject[key].push(value)
        }
      }
    } else if (key.includes(QUERY_MAPPING.sort.code)) {
      selected[key.split(QUERY_MAPPING.separate.code)[0]] = {
        direction: value
      }
    } else if (key.includes(QUERY_MAPPING.page.code)) {
      selected[key] = parseInt(value)
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

function getPrice(price) {
  return price ? convertPrice(price) * 100 : 0
}

function convertPrice(price) {
  return typeof price === 'string' ? parseFloat(price) : price
}

function getImages(...attrs) {
  return attrs.filter((item) => item)
}

export {
  QUERY_MAPPING,
  groupParamsByKey,
  getPrice,
  getImages
}
