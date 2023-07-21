import logo from '../assets/logo.svg';

const Navigation = ({ account, setAccount }) => {
// button that connect to real account
// sets to component state of the parent component (app.js)
// passes back in with <Navigation account={account} setAccount={setAccount} /> in App.js
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        setAccount(accounts[0]) // write to the state.
    }

// {account ? ()}
// -> if account exist show on page (truncate it).
// -> if it doesn't exist allow you to connect to metamask (connect button).

// loads the account with (const Navigation = ) above.
// saves to component state in (App.js).
// passes in (<Navigation account={account} setAccount={setAccount} /> in App.js).

    return (
        <nav>
            <ul className='nav__links'>
                <li><a href="#">Buy</a></li>
                <li><a href="#">Rent</a></li>
                <li><a href="#">Sell</a></li>
            </ul>

            <div className='nav__brand'>
                <img src={logo} alt="Logo" />
                <h1>Rocket</h1>
            </div>

            {account ? (
                <button
                    type="button"
                    className='nav__connect'
                >
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
            ) : (
                <button
                    type="button"
                    className='nav__connect'
                    onClick={connectHandler}
                >
                    Connect
                </button>
            )}
        </nav>
    );

}

export default Navigation;
