const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('./dev/Blockchain')
const uuid=require('uuid/v1')

const nodeAddress=uuid().split('-').join('')

const blockchain = new Blockchain()
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/blockchain', (req, res) => {
    res.send(blockchain)
})
app.post('/transaction', (req, res) => {
    const blockIndex = blockchain.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    res.json({note: `Transaction will be added in block ${blockIndex}.`})
})
app.get('/mine', (req, res) => {
    const lastBlock = blockchain.getLastBlock()
    const previousBlockHash = lastBlock.hash
    const currentBlockData = {
        transactions: blockchain.pendingTransactions,
        index: lastBlock.index + 1
    }
    const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce)

    blockchain.createNewTransaction(12.5,"00",nodeAddress)


    const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, blockHash)
    res.json({note:'New block mined successfully',newBlock})
})

app.listen(3000, () => console.log("Server started"))