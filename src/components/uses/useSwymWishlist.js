export default class SwymWishlistServices {
  constructor() {
    if (!window.SwymCallbacks) {
      window.SwymCallbacks = []
    }
  }

  getAllList() {
    return new Promise((resolve, reject) => {
      try {
        const fetchList = async () => {
          const list = await this.fetchLists()
          this.list = list || []
          resolve(this.list)
        }
        fetchList()
      } catch (error) {
        reject(error)
      }
    })
  }

  getListShareId() {
    return new Promise((resolve, reject) => {
      try {
        const queryParams = _swat.utils.getEncodedAsObject(window.location.search)
        const lid = queryParams.lid
        this.lid = lid
        resolve(lid)
      } catch (error) {
        reject(error)
      }
    })
  }

  async createList(listName) {
    if (!window._swat) return

    return new Promise((resolve, reject) => {
      const listConfig = {
        lname: listName
      }
      _swat.createList(
        listConfig,
        (list) => resolve(list),
        (error) => reject(error)
      )
    })
  }

  async deleteList(lid) {
    if (!window._swat) return

    return new Promise((resolve, reject) => {
      _swat.deleteList(
        lid,
        (list) => resolve(list),
        (error) => reject(error)
      )
    })
  }

  async fetchLists() {
    if (!window._swat) return

    return new Promise((resolve, reject) => {
      _swat.fetchLists({
        callbackFn: (lists) => resolve(lists),
        errorFn: (error) => reject(error)
      })
    })
  }

  async addToWishlist(lid, payload) {
    if (!window._swat) return
    return new Promise((resolve, reject) => {
      const product = {
        epi: payload.epi,
        empi: payload.empi,
        du: payload.du,
        cprops: payload.cprops
      }
      _swat.addToList(
        lid,
        product,
        (addedItem) => resolve(addedItem),
        (error) => reject(error)
      )
    })
  }

  async addToMultiWishlist(lids, payload) {
    if (!window._swat) return
    return new Promise((resolve, reject) => {
      const product = {
        epi: payload.epi,
        empi: payload.empi,
        du: payload.du,
        cprops: payload.cprops
      }
      _swat.addProductToLists(
        product,
        lids,
        (addedItem) => resolve(addedItem),
        (error) => reject(error)
      )
    })
  }

  async fetchListDetails(lid) {
    if (!window._swat) return
    const listConfig = {
      lid
    }

    return new Promise((resolve, reject) => {
      _swat.fetchListDetails(
        listConfig,
        (list) => resolve(list),
        (error) => reject(error)
      )
    })
  }

  async fetchWishlistContent(lid) {
    if (!window._swat) return
    const listConfig = {
      lid
    }

    return new Promise((resolve, reject) => {
      _swat.fetchListCtx(
        listConfig,
        (list) => resolve(list),
        (error) => reject(error)
      )
    })
  }

  async removeFromWishlist(lid, payload) {
    if (!window._swat) return
    return new Promise((resolve, reject) => {
      const product = {
        epi: payload.epi,
        empi: payload.empi,
        du: payload.du
      }
      _swat.deleteFromList(
        lid,
        product,
        (removedItem) => resolve(removedItem),
        (error) => reject(error)
      )
    })
  }

  async removeFromMultiWishlist(lids, payload) {
    if (!window._swat) return
    return new Promise((resolve, reject) => {
      const product = {
        epi: payload.epi,
        empi: payload.empi,
        du: payload.du
      }
      _swat.removeProductFromLists(
        product,
        lids,
        (removedItem) => resolve(removedItem),
        (error) => reject(error)
      )
    })
  }

  async sendListViaEmail(lid, payload) {
    if (!window._swat) return

    return new Promise((resolve, reject) => {
      const params = {
        toEmailId: payload.email,
        fromName: payload.name,
        note: payload.note,
        lid
      }
      _swat.sendListViaEmail(
        params,
        (listInfo) => resolve(listInfo),
        (error) => reject(error)
      )
    })
  }

  async generateSharedListURL(lid) {
    if (!window._swat) return

    return new Promise((resolve, reject) => {
      _swat.generateSharedListURL(
        lid,
        (url) => resolve(url),
        (error) => reject(error)
      )
    })
  }

  async shareListSocial(lid, payload) {
    if (!window._swat) return

    const platformShareUrlTemplate = _swat.retailerSettings.Wishlist.SharingModes.find((mode) => mode.type === payload.platform)
    if (platformShareUrlTemplate) {
      _swat.shareListSocial(lid, payload.name, platformShareUrlTemplate.url, payload.platform, payload.note, (error) => console.log(error))
    }
  }
}
