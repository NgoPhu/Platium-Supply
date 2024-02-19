/* global GM_STATE */

/**
 * @returns { {
 *    'Content-Type': 'application/json',
 *    Accept: 'application/json',
 *    'X-Shopify-Storefront-Access-Token': string
 * } }
 */
function getGraphQlHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': GM_STATE.apis.storefrontAccessToken
  }
}

/**
 * Returns graphql request with no callback
 * @param { {
 *  query: string
 *  variables?: unknown
 * } } param0
 * @returns { fetch }
 */
export function executeGraphQlQuery({ query, variables }) {
  const url = GM_STATE.apis.graphQlEndpoint

  // remove line breaks and double space for legibility
  const cleanQuery = query.replace(/\n/g, ' ').replace(/ {2}/g, '')

  const config = {
    method: 'post',
    headers: getGraphQlHeaders(),
    body: JSON.stringify({
      query: cleanQuery,
      // only add variables if they actually exist
      ...(variables ? { variables } : {})
    })
  }

  return fetch(url, config)
}
