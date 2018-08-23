# Translations/CMS

Meteor React package for translations and CMS.

## Installation

Git clone this repository into your projects `packages` folder and `meteor add lef:translations`.

## Text component

Use the `<Translate />` React component to insert text in the app. Editing the translation is possible by double clicking on it while logged in as admin. Optionally use `md` to set as a textfield (with markdown support). Set `getString` to only get the translation string returned. Default a `<span>` will be returned.

```JSX
import { Translate } from "meteor/lef:translations";

<Translate _id="welcome_message" md />
```

## Admin component

Insert the `<Translations />` React component in an admin interface to edit all translations. Make sure the user has the `"admin"` role set in their user account.

## Pick language menu

```JSX
import { PickLanguage } from "meteor/lef:translations";

<PickLanguage />
```

## API

```JSX
import { Translator } from "meteor/lef:translations";

const translator = new Translator()

// SET
translator.setLanuages(["nl", "fr", "en"])
translator.setDefault("nl")
translator.setCurrentLanguage("fr")

// GET
translator.getLanguages()
translator.getCurrentLanguage()
translator.getDefault()
```
