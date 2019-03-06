import React from 'react'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withTranslator } from './Translator'
import { size } from 'lodash'

const PickLanguage = withTranslator(({ translator }) => {
  if (size(translator.languages) <= 1) return null
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
              {translator.currentLanguage === language ? (
                <FontAwesomeIcon icon={'check'} />
              ) : null}
            </a>
          )
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
})

export default PickLanguage
