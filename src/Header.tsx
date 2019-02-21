import React, { useState } from 'react'

interface HelpLinkProps {
  url?: string
  anchor: string
  classes: string
}

const HelpLink = (props: HelpLinkProps) => {
  const url = props.url || 'https://github.com/davedx/datadojo/issues'
  return <a
  className={props.classes}
  target='__blank'
  href={url}>
    {props.anchor}
  </a>
}

const Help = () => <div>
  <h2>Help</h2>

  <p>Data Dojo is a playground for <span className='help-exp'>experimenting</span>, <span className='help-col'>collaborating</span> and <span className='help-deb'>debugging</span>.</p>

  <div className='help-body'>
    <ul>
      <li>Paste JSON or CSV data into the first input area (CSV will be parsed into an array of arrays)</li>
      <li>Write transforms in the transform area in JavaScript or Python (<HelpLink
        classes='link'
        anchor='request Scala, Julia or something else'
        />)
      </li>
      <li><HelpLink
        classes='link'
        anchor='Lodash is included'
        url='https://lodash.com/docs'
      /> - you can use _.flatMap and its friends in your code</li>
      <li>If your final output is an array of arrays, you can download it as a CSV file, or copy the CSV URL and pandas.read_csv() it in Jupyter Notebooks</li>
      <li>Final output is also available as a JSON URL</li>
      <li>Paste a URL into the first input to load data from that URL. Be careful pasting URLs from third party sources - always check your input data.</li>
      <li>Use the left controls to add data conditions (like unit tests for data). Condition data paths use Lodash _.get</li>
      <li>Your Dojo URL is a unique generated ID and your work is auto-saved for you. Copy the URL from your address bar and share it freely</li>
    </ul>
  </div>
</div>

export const Header = () => {
  const [visible, setVisible] = useState(false)
  
  return <div className='header'>
    <div className='modal help-modal' style={{display: visible ? 'block' : 'none'}}>
      <Help />
    </div>
    Data Dojo
    <div className='header-links'>
      <HelpLink
        classes='header-link hl-right'
        url='/'
        anchor='Home'
        />
      <HelpLink
        classes='header-link hl-right'
        anchor='Feature requests'
        />
      <a
        className='header-link hl-right'
        onClick={e => { setVisible(!visible) }}
        >
        Help
      </a>
    </div>
  </div>
}
