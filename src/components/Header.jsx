import React from 'react';


const Header = (props) => {
    return <header >
        <img src={props.logo} className="App-logo" alt="logo" />
        <h1 className="pageName">TLEnfo</h1>
    </header>
}

export default Header;