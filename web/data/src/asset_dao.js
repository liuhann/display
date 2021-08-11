import Axios from 'axios'

class AssetDAO {
  constructor (serviceUrl) {
    this.serviceUrl = serviceUrl

    this.instance = Axios.create({
      baseURL: serviceUrl,
      timeout: 5000
    })
  }

  async getPublicAssets () {
    const response = await this.instance.get('/api/repo/list/standard/latest')

    return response.data
  }
}

export default AssetDAO
