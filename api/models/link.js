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
      type: 'string',
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
    }
  }

};
