import React from 'react'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faCheck } from '@fortawesome/free-solid-svg-icons'
import fontawesome from '@fortawesome/fontawesome'
import { withTranslator } from './Translator'

fontawesome.library.add(faFlag)

const PickLanguage = withTranslator(({ translator }) => {
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon='flag' />
      </DropdownToggle>
      <DropdownMenu right>
        {translator.languages.map(language => {
          return (
            <a
              href='#'
              className='dropdown-item'
              key={language}
              onClick={() => {
                translator.setCurrentLanguage(language)
              }}
            >
              {language}{' '}
              {translator.currentLanguage === language
                ? <FontAwesomeIcon icon={faCheck} />
                : null}
            </a>
          )
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
})

export default PickLanguage
