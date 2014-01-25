/**
 * Links
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
    // 'http://greencubes.org'
    originalURL: {
      type: 'url',
      required: true
    },
    // 'vFDh42'
    shortURL: {
      type: 'string',
      required: true
    },
    //'42'
    visitors: {
      type: 'integer',
      required: true
    },
    //'1b7b889153edbfb7f70d9da23d64b574b34411aa'
    delink: {
      type: 'string'
    }
  }

};
