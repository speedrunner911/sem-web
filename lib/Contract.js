
const Method = require('./Method.js')

class Contract {
  constructor(semWeb = false, abi = [], address = '0x0') {
    if (!semWeb) throw new Error('Exprected instance of SemWeb')
    this.semWeb = semWeb;
    this.address = address
    this.abi = abi;
    this.methods = {}
    this.methodInstances = {}
    this.props = []

    this.loadAbi(abi)
  }

  loadAbi(abi = []) {
    this.abi = abi;
    this.methods = {}
    abi.forEach((func) => {
      const method = new Method(this, func)
      const methodCall = method.onMethod.bind(method)

      const { name, functionSelector, signature } = method
      this.methods[name] = methodCall;
      this.methods[functionSelector] = methodCall;
      this.methods[signature] = methodCall;

      this.methodInstances[name] = method;
      this.methodInstances[functionSelector] = method;
      this.methodInstances[signature] = method;

      if (!this.hasProperty(name)) {
        this[name] = methodCall;
        this.props.push(name);
      }

      if (!this.hasProperty(functionSelector)) {
        this[functionSelector] = methodCall;
        this.props.push(functionSelector);
      }

      if (!this.hasProperty(signature)) {
        this[signature] = methodCall;
        this.props.push(signature);
      }
    })
  }

  hasProperty(property) {
    // eslint-disable-next-line no-prototype-builtins
    return this.hasOwnProperty(property) || this.__proto__.hasOwnProperty(property);
  }
}

module.exports = Contract
