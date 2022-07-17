import polka from 'polka'
import { isValidAddress, isValidChecksumAddress } from 'ethereumjs-util'
import mew from '../node_modules/mew/dist/master-file.json'
// import tokenDir from '../node_modules/token-directory/index/mainnet/erc20.json'
const { PORT = 3000 } = process.env

const CHAINS: { [key: number]: string } = {
  1: 'eth',
  4: 'rin',
  56: 'bsc'
}

const jsonSend = (req: any, res: { json: (payload: any) => void; setHeader: (arg0: string, arg1: string) => void; end: (arg0: string) => void }, next: () => void) => {
  res.json = (payload) => {
    res.setHeader('Content-Type', 'application/json')
    const jsonResponse = JSON.stringify(payload)
    res.end(jsonResponse)
  }
  next()
}

polka()
  .use(jsonSend)
  .get('/v', (req, res) => {
    const { name, version: v } = require('../package.json')
    res.json({ name, v })
  })
  .get('/token/erc20/:chainId/:address', (req, res) => {
    let { chainId, address } = req.params
    const chain = CHAINS[+chainId]

    if (!isValidAddress(address)) {
      res.statusCode = 400
      return res.json({ error: 'incorrect address format' })
    }

    if (!isValidChecksumAddress(address)) {
      res.statusCode = 400
      return res.json({ error: 'invalid address checksum' })
    }

    // MEW
    const found = mew.find((x: { network: string; contract_address: string }) =>
      x.network === chain &&
      x.contract_address == address
    )

    if (!found) {
      res.statusCode = 404
      return res.json({ error: 'token not found' })
    }

    const { name, symbol, decimals, icon_png: logoSmall } = found
    return res.json({
      chainId: +chainId,
      address,
      name,
      symbol,
      decimals,
      logoSmall,
    })

		// Temporary Disabled:
    // {
    //   // Token-Directory
    //   const found = tokens.tokenDir.tokens.find((x: { chainId: string; address: string }) =>
    //     x.chainId === chainId &&
    //     x.address == address
    //   )

    //   if (found) {
    //     const { name, symbol, decimals, logoURI: logoSmall } = found
    //     return res.json({
    //       chainId: 1,
    //       address,
    //       name,
    //       symbol,
    //       decimals,
    //       logoSmall,
    //     })
    //   }
    // }

  })
  .listen(PORT, (err: any) => {
    if (err) throw err;
    console.log(`> running on :${PORT}`)
  })
