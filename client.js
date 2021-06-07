import Translator, { withTranslator } from './TranslatorWrapper'
import Translate from './Translate'
import Translations from './Translations'
import { PickLanguage } from '@lefapps/translations'
import { MarkdownHelp } from '@lefapps/translations'
import { client } from './apollo/client'

export default Translate
export {
  Translator,
  withTranslator,
  Translate,
  PickLanguage,
  Translations,
  client,
  MarkdownHelp
}
