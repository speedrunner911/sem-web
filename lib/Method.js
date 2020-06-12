
const getParamTypes = (params) => params.map(({ type }) => type)


const getFunctionSelector = (abi) => {
  return `${abi.name}(${getParamTypes(abi.inputs || []).join(',')})`
}

class Method {
  constructor(contract, abi) {
    this.semWeb = contract.semWeb
    this.contract = contract
    this.abi = abi
    this.name = abi.name || (abi.name = abi.type);
    this.inputs = abi.inputs || [];
    this.outputs = abi.outputs || [];

    this.functionSelector = getFunctionSelector(abi);
    this.signature = this.semWeb.sha3(this.functionSelector, false).slice(0, 8);

    this.defaultOptions = {
      feeLimit: 1000000000,
      callValue: 0,
      from: this.semWeb.defaultAddress.hex, // Only used for send()
      shouldPollResponse: false, // Only used for sign()
    };
  }

  onMethod(...args) {
    const types = getParamTypes(this.inputs);

    args.forEach((arg, index) => {
      if (types[index] === 'address') {
        args[index] = this.semWeb.address.toHex(arg).replace(/^(41)/, '0x')
      }
      if (types[index] === 'address[]') {
        args[index] = args[index].map((address) => this.semWeb.address.toHex(address).replace(/^(41)/, '0x'))
      }
    })
    return {
      call: (...methodArgs) => this._call(types, args, ...methodArgs),
      send: (...methodArgs) => this._send(types, args, ...methodArgs),
    }
  }

  async _call(types, args, options = {}) {
    if (types.length !== args.length) throw new Error('Invalid argument count provided')
    if (!this.contract.address) throw new Error('Smart contract is missing address, please provide it')
    const { stateMutability } = this.abi;
    if (!['pure', 'view'].includes(stateMutability.toLowerCase())) {
      throw new Error(`Methods with state mutability "${stateMutability}" must use send()`)
    }
    options = { ...this.defaultOptions, ...options }
    // paramets that we send
    const parameters = args.map((value, index) => ({
      type: types[index],
      value,
    }))

    const res = await this.semWeb.transactionBuilder.triggerSmartContract(
      this.contract.address,
      parameters,
      this.functionSelector,
    )
    if (res.success) {
      const isInt = Number.isInteger(parseInt(res.result.returnData, 16));
      if (isInt) return parseInt(res.result.returnData, 16)
      // return toUtf8
      return this.semWeb.toUtf8(res.result.returnData)
    }
    throw new Error('Cannot make local call')
  }

  async _send(types, args, options = {}, privateKey = this.semWeb.defaultPrivateKey) {
    // validate all this info
    options.callValue = options.value
    if (types.length !== args.length) throw new Error('Invalid argument count provided')
    if (!this.contract.address) throw new Error('Smart contract is missing address, please provide it')
    const { stateMutability } = this.abi;
    if (['pure', 'view'].includes(stateMutability.toLowerCase())) {
      throw new Error(`Methods with state mutability "${stateMutability}" must use send()`)
    }
    if (!['payable'].includes(stateMutability.toLowerCase())) options.callValue = 0

    options = { ...this.defaultOptions, ...options }
    const parameters = args.map((value, index) => ({
      type: types[index],
      value,
    }))

    try {
      const evmTx = await this.semWeb.transactionBuilder.sendSmartContract(
        this.contract.address,
        parameters,
        this.functionSelector,
        options.feeLimit,
        options.callValue,
        options.from,
      )
      const signedTranasction = await this.semWeb.sem.sign(evmTx, this.semWeb.defaultPrivateKey)
      const result = await this.semWeb.sem.sendSignedTransaction(signedTranasction)
      return result
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = Method
