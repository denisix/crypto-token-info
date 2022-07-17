# crypto-token-info
The microservice provides token details based on chain ID and token Address

# About
There are lots of cryptocurrency tokens issued, with large community and small, well known and not so.
You can fetch basic information about all them using this microservice, for example you can show their icons on your website, etc.

# Get started
```sh
git clone https://github.com/denisix/crypto-token-info
npm i
npm start
```

# API
Please check the following queries to get a basic idea how to use them this microservice:

```json
$ curl -s http://0:3000/token/erc20/rin/1/0xe27826eE778B6F78a49a686dA7D64f6E7b084a4f | json_pp
{
   "address" : "0xe27826eE778B6F78a49a686dA7D64f6E7b084a4f",
   "chainId" : 1,
   "decimals" : 0,
   "logoSmall" : "",
   "name" : "Berlin Hack&Tell winner token",
   "symbol" : "BHNT"
}
```

error cases here:
```json
$ curl -s http://0:3000/token/erc20/rin/1/0xe27826eE778B6F78a49a686dA7D64f6E7b084a4F | json_pp
{
   "error" : "invalid address checksum"
}
```

```json
$ curl -s http://0:3000/token/erc20/rin/1/0xe2 | json_pp
{
   "error" : "incorrect address format"
}
```
