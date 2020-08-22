import React from 'react';


const Header = (props) => {
    return <header >
        <img src={props.logo} class="App-logo" alt="logo" />
        <h1 class="pageName">TLEnfo</h1>
    </header>
}

export default Header;