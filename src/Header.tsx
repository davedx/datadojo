import React from 'react'

const showHelp = () => {
console.log('halp!')
}

export const Header = () =>
  <div className='header'>
    <a
      className='header-link hl-left'
      target='__blank'
      href='https://github.com/davedx/datadojo/issues'>
      Feature requests
    </a>
    Data Dojo
    <a
      className='header-link hl-right'
      onClick={e => { showHelp() }}
      >
      Getting started
    </a>
  </div>

