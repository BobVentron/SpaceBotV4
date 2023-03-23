class InfosProvider {

  infos = require('../prices.json')

  constructor(){

  }

  get (key) {
    const keyExploded = key.split("/")
    return this.infos[keyExploded[0]].find(o => o.name == keyExploded[1]).properties
  }
}

module.exports = InfosProvider;