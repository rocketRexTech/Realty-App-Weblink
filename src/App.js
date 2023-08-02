import { useState } from 'react';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import HomeCard from 'components/HomeCard';

import { HOME__DATA } from 'components/data';

function App() {
  const [account, setAccount] = useState(null) 
  const [toggle, setToggle] = useState(false);
  const [home, setHome] = useState(null);


const togglePop = (data) => {
  setToggle(!toggle)
  setHome(data)
}

  return (
    <div>

      <Navigation account={account} setAccount={setAccount} />
      <Search />

      <div className='cards__section'>

        <h3>Explore Homes</h3>

        <hr /> 

        <div className='cards'>
          {
             HOME__DATA.map((item) => (
              <div className='card' key={item.id} onClick={() => togglePop(item)}>

                <div className='card__image'>
                  <img src={item.image} alt="Home"/>
                </div>

                <div className='card__info'>
                  <h4>{item.attributes[0].value} ETH</h4>
                  <p>
                    <strong>{item.attributes[2].value}</strong> bds |
                    <strong>{item.attributes[3].value}</strong> ba |
                    <strong>{item.attributes[4].value}</strong> sqft
                  </p>

                  <p>{item.address}</p>
                </div>

            </div>
            ))
          }
        </div>
        {toggle  && (
          <HomeCard togglePop={togglePop} item={home} />
        )}
      </div>

    

    </div>
  );
}

export default App;
