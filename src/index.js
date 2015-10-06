import './index.css';
import React from 'react';
import Profile from './components/profile';

const data = {
  username: 'John Doe',
  avatar: {
    src: 'http://placehold.it/200x200',
    alt: 'Image of John Doe'
  }
};

const App = React.createClass({

  displayName: 'App',

  render(){
    return (<Profile/>)
  }

});


React.render(React.createElement(App, { userData: data }), document.body);