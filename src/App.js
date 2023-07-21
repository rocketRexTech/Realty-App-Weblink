import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json';

function App() {
// ethers is the library our project to the blockchain (ethers provider).
// -> create function for reading and setting the  account to component state. (by default is account doesn't exist return a null value)

  // Hook
  // gives two different functions (1) read account from the state (2) set account to the state.
  const [provider, setProvider] = useState(null)
  const [escrow, setEscrow] = useState(null)
  const [account, setAccount] = useState(null) 
  const [homes, setHomes] = useState([])
  const [home, setHome] = useState([])
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

// connect to blockchain, get the smart contrcts and lod them onto app
    const network = await provider.getNetwork()// finds where the contract is deployed with (config.js)


// config as javascript function so we can call its function (realEstate and Escrow)
// -> get total supply of homes.
    const realEstate = new ethers.Contract(config[network.chainId].realEstate.address, RealEstate, provider) // (RealEstate) is smart contract ABI //give ethers provider with (provider)
    const totalSupply = await realEstate.totalSupply()

// store homes so we can list them out in (return{}) below.
// # because we store our real estate inside on a mapping (RealEstate.sol) we can't get them all.
// # figure out how many properties there are and loop through all the nfts and fetch them out one by one.
    const homes = [] // we know there are 3 nftd
    for(var i = 1; i <= totalSupply; i++) {
      const uri = await realEstate.tokenURI(i) // set it to "i".
      const response = await fetch(uri)
      const metadata = await response.json() // get metadata from ipfs
      homes.push(metadata) // pushes to home array
    }
    setHomes(homes)
    

    // stave it to our state (const [escrow, setEscrow] = useState(null))
    const escrow = new ethers.Contract(config[network.chainId].escrow.address, Escrow, provider) // (Escrow) is smart contract ABI //give ethers provider with (provider)
    setEscrow(escrow) // load escrow contract

    // config[network.chainId].realEstate.address
    // config[network.chainId].escrow.address

// change/update page is you change account inside metamask
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
    
  }

// calls loadBlockchainDate() (useEffect hook)
useEffect(() => {
  loadBlockchainData()
}, [])

const togglePop = (home) => {
  setHome(home)
  toggle ? setToggle(false) : setToggle(true)
}

  return (
    <div>

      <Navigation account={account} setAccount={setAccount} />
      <Search />

      <div className='cards__section'>

        <h3>Explore Homes</h3>

        <hr /> 

        <div className='cards'>
          {homes.map((home, index) => (
            <div className='card' key={index} onClick={() => togglePop(home)}>

              <div className='card__image'>
                <img src={home.image} alt="Home"/>
              </div>

              <div className='card__info'>
                <h4>{home.attributes[0].value} ETH</h4>
                <p>
                  <strong>{home.attributes[2].value}</strong> bds |
                  <strong>{home.attributes[3].value}</strong> ba |
                  <strong>{home.attributes[4].value}</strong> sqft
                </p>

                <p>{home.address}</p>
              </div>
            
          </div>
          ))}
          
        </div>

      </div>

      {toggle  && (
        <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={togglePop} />
      )}

    </div>
  );
}

export default App;
