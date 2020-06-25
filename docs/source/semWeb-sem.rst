.. _sem:

========
semWeb.sem
========

The ``semWeb-sem`` package allows you to interact with an Semux blockchain and Semux smart contracts.

------------------------------------------------------------------------------

.. _sem-getblock:

getBlock
=====================

.. code-block:: javascript

     semWeb.sem.getBlock(blockHashOrBlockNumber)

Returns a block matching the block number or block hash.

----------
Parameters
----------

1. ``String|Number|BN|BigNumber`` - The block number or block hash. Or the string ``"earliest"`` or  ``"latest"`` as in the :ref:`default block parameter <eth-defaultblock>`.

-------
Returns
-------


``Promise`` returns ``Object`` - The block object:

  - ``hash`` 32 Bytes - ``String``: Hash of the block. 
  - ``number`` - ``String``: The block number.
  - ``view`` - ``Number``: The view number
  - ``coinbase`` - ``String``: The address of the beneficiary to whom the staking rewards were given.
  - ``parentHash``- 32 Bytes - ``String``: Hash of the parent block.
  - ``timestamp`` - ``String``: The unix timestamp for when the block was collated.
  - ``transactionsRoot`` 32 Bytes - ``String``: The root of the transaction trie of the block.
  - ``resultsRoot`` - 32 Bytes - ``String``: The root of the final state trie of the block.
  - ``stateRoot`` - 32 Bytes - ``String``: The root of the state trie of the block.
  - ``data`` - ``String`` : The "data" field of this block.  
  - ``transactions`` - ``Array``: Array of transaction objects.

-------
Example
-------


.. code-block:: javascript

    semWeb.sem.getBlock(4261)
      .then(console.log);

    > {
      hash: '0x2a57fa6ae468a1c540bf75b971685b6d6c1d3ba679c57ca683580f35177c12b9',
      number: '4261',
      view: 0,
      coinbase: '0xc5f32c2231ff2b60cdfa9c0d3a9c2e71774de472',
      parentHash: '0x6709b3d6100df120e9b1c4f588a3ac12a1f6080825300d8223be84abda0f4072',
      timestamp: '1562716949721',
      transactionsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      resultsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      stateRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      data: '0x',
      transactions: [
        {
          hash: '0xadadc78e064f7e78016cf47bc062c47404f0db3e451212c7c2c9e0df92b67dc1',
          type: 'COINBASE',
          from: '0xce6f439a900346a4265b37a1046a625e9fd6d249',
          to: '0xc5f32c2231ff2b60cdfa9c0d3a9c2e71774de472',
          value: '3000000000',
          fee: '0',
          nonce: '4261',
          timestamp: '1562716949721',
          data: '0x',
          gas: '0',
          gasPrice: '0'
        }
      ]
    }



------------------------------------------------------------------------------

getBlockTransactionCount
=====================

.. code-block:: javascript

    semWeb.sem.getBlockTransactionCount(blockHashOrBlockNumber)

Returns the number of transaction in a given block.

----------
Parameters
----------


1. ``String|Number|BN|BigNumber`` - The block number or hash. Or the string ``"earliest"``, ``"latest"`` or ``"pending"`` as in the :ref:`default block parameter <eth-defaultblock>`.

-------
Returns
-------


``Promise`` returns ``Number`` - The number of transactions in the given block.

-------
Example
-------


.. code-block:: javascript

    semWeb.sem.getBlockTransactionCount("0xcea899c800996d26963191aa7bc10102c726f8f67ef6fe1375af9ebfc14e81ca")
    .then(console.log);
    > 1



------------------------------------------------------------------------------



getTransaction
=====================

.. code-block:: javascript

    semWeb.sem.getTransaction(transactionHash)

Returns a transaction matching the given transaction hash.

----------
Parameters
----------

1. ``String`` - The transaction hash.


.. _sem-gettransaction-return:

-------
Returns
-------


``Promise`` returns ``Object`` - A transaction object its hash ``transactionHash``:

  - ``hash`` 32 Bytes - ``String``: Hash of the transaction.
  - ``type`` - ``String`` : Transaction type.
  - ``from`` - ``String``: Address of the sender.
  - ``to`` - ``String``: Address of the receiver. ``null`` if it's a contract creation transaction.
  - ``value`` - ``String``: Value transferred in wei.
  - ``fee`` - ``String`` : Amount of fee. 
  - ``nonce`` - ``String``: The number of transactions made by the sender prior to this one.
  - ``timestamp`` - ``String``: The unix timestamp for when the transaction was complete. 
  - ``data`` - ``String``: The data sent along with the transaction.
  - ``gas`` - ``String``: Gas provided by the sender.
  - ``gasPrice`` - ``String``: Gas price provided by the sender in :ref:`wei <what-is-wei>`.


-------
Example
-------


.. code-block:: javascript

    semWeb.sem.getTransaction('0xb076efc93e29a2201b8f694b0f42817ee5358bb50f4b45e3bd00e7b926931f70')
    .then(console.log);

    > {
      hash: '0xb076efc93e29a2201b8f694b0f42817ee5358bb50f4b45e3bd00e7b926931f70',
      type: 'TRANSFER',
      from: '0xa912c9080368d4ad1a8f2d8952d51ec278336fe1',
      to: '0xfdfc77d92c0981602a30629db30f09ff4ddbec49',
      value: '3734603191',
      fee: '5000000',
      nonce: '707',
      timestamp: '1590996601768',
      data: '0x746573745f736176656c',
      gas: '0',
      gasPrice: '0'
    }

------------------------------------------------------------------------------

getTransactionFromBlock
=====================

.. code-block:: javascript

    getTransactionFromBlock(hashStringOrNumber, indexNumber)

Returns a transaction based on a block hash or number and the transaction's index position.

----------
Parameters
----------


1. ``String|Number|BN|BigNumber`` - A block number or hash. Or the string ``"earliest"``, ``"latest"`` or ``"pending"`` as in the :ref:`default block parameter <eth-defaultblock>`.
2. ``Number`` - The transaction's index position.

-------
Returns
-------


``Promise`` returns ``Object`` - A transaction object, see :ref:`semWeb.sem.getTransaction <sem-gettransaction-return>`:


-------
Example
-------


.. code-block:: javascript

    var transaction = semWeb.sem.getTransactionFromBlock(123, 0)
    .then(console.log);
    > // see web3.eth.getTransaction


------------------------------------------------------------------------------


.. _sem-gettransactioncount:

getTransactionCount
=====================

.. code-block:: javascript

    semWeb.sem.getTransactionCount(address)

Get the number of transactions sent from this address.

----------
Parameters
----------

1. ``String`` - The address to get the numbers of transactions from.

-------
Returns
-------


``Promise`` returns ``Number`` - The number of transactions sent from the given address.

-------
Example
-------


.. code-block:: javascript

    semWeb.sem.getTransactionCount("0xc5f32c2231ff2b60cdfa9c0d3a9c2e71774de472")
    .then(console.log);
    > 1

------------------------------------------------------------------------------


.. _sem-getbalance:

getBalance
=====================

.. code-block:: javascript

    semWeb.sem.getBalance(address)

Get the number of transactions sent from this address.

----------
Parameters
----------

1. ``String`` - The address to get the balance of address.

-------
Returns
-------


``Promise`` returns ``Object`` - The object that contains information about given address.

    - ``address`` - ``String``: The account address.
    - ``available`` - ``String`` : Number of available coins.
    - ``locked`` - ``String``: Number of locked coins.
    - ``nonce`` - ``String`` : Nonce of address.
    - ``transactionCount`` - ``Number`` : Number of confirmed transactions.
    - ``internalTransactionCount`` - ``Number`` : Number of internal transactions.
    - ``pendingTransactionCount`` - ``Number`` : Number of pending transactions.
-------
Example
-------


.. code-block:: javascript

    semWeb.sem.getBalance("0xc5f32c2231ff2b60cdfa9c0d3a9c2e71774de472")
    .then(console.log);
    > {
      address: '0xc5f32c2231ff2b60cdfa9c0d3a9c2e71774de472',
      available: '97453607100000',
      locked: '0',
      nonce: '2',
      transactionCount: 83324,
      internalTransactionCount: 0,
      pendingTransactionCount: 0
    }

------------------------------------------------------------------------------


.. _sem-getnonce:

getNonce
=====================

.. code-block:: javascript

    semWeb.sem.getNonce(address)

Get the nonce of address.

----------
Parameters
----------

1. ``String`` - The address to get the nonce.

-------
Returns
-------


``Promise`` returns ``Number`` - The number of nonce.

-------
Example
-------


.. code-block:: javascript

    semWeb.sem.getNonce("0xc5f32c2231ff2b60cdfa9c0d3a9c2e71774de472")
    .then(console.log);
    > 2

------------------------------------------------------------------------------


.. _sem-getnetworkinfo:

getNetworkInfo
=====================

.. code-block:: javascript

    semWeb.sem.getNetworkInfo()

Get state of current network.


-------
Returns
-------


``Promise`` returns ``Object`` - The object that contains information about connected network.

    - ``network`` - ``String``: Type of network.
    - ``capabilities`` - ``Array`` : The array of semux client.
    - ``clientId`` - ``String``: The string of client data.
    - ``coinbase`` - ``String`` : The address of validator who minted latest block.
    - ``latestBlockNumber`` - ``String`` : The number of latest block.
    - ``latestBlockHash`` - ``String`` : The hash of latest block.
    - ``activePeers`` - ``Number`` : The number of active peers.
    - ``pendingTransactions`` - ``Number`` : The number of pending transactions.
-------
Example
-------


.. code-block:: javascript

    semWeb.sem.getNetworkInfo()
    .then(console.log);
    > {
      network: 'TESTNET',
      capabilities: [ 'SEMUX', 'FAST_SYNC' ],
      clientId: 'Semux/v2.1.1-e8314f7/Linux/amd64',
      coinbase: '0x23a6049381fd2cfb0661d9de206613b83d53d7df',
      latestBlockNumber: '907277',
      latestBlockHash: '0x957064447d9ab3f26be9cbceec5f2e87a416849f2b042e78d89f8636909206f2',
      activePeers: 8,
      pendingTransactions: 0
    }
