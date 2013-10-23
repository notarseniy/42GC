/**
 * LangController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  ru: function (req,res) {
    req.setLocale('ru');
    res.redirect('/');
  },

  en: function (req,res) {
    console.log(req.getLocale);
    req.setLocale('en');
    res.redirect('/');
  }

};
//FIXME: Make i18n workable in 0.3
