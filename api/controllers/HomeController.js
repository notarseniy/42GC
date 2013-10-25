/**
 * HomeController
 *
 * @module    :: Controller
 * @description  :: Contains logic for handling requests.
 */
var rand = require('generate-key');
var crypto = require('crypto');

module.exports = {

  index: function(req,res){
    res.etagify();
    res.view();
  },

  shorten: function shorten(req,res){
    res.etagify();
    
    if (!req.body.url) return res.view('home/index',{message: 'Введите URL!'});
    shorten.url = req.body.url;//Original URL
    
    if (!req.body.name) {// Short URL
      shorten.sUrl = rand.generateKey(4);
    } else {
      shorten.sUrl = req.body.name.replace(/[^a-zA-Z0-9-_]/g, '');
    }

    link.findOne({
      shortURL: shorten.sUrl
    }).done(function(err, link) {
      if (link) {
        return res.view('home/index',{message: 'Увы, но этот короткий адрес уже занят'});
      }
    });

    shorten.delink = crypto.createHash('sha1').update(shorten.sUrl + rand.generateKey(8)).digest('hex');

    link.create({
          originalURL: shorten.url,
          shortURL: shorten.sUrl,
          visitors: '0',
          delink: shorten.delink
      }).done(function(err, link) {
        if (err) {
          return new Error(err);
        }
        else {
          res.view({originalURL: shorten.url, shortURL: shorten.sUrl, delink: shorten.delink});
        }
      });
  },

  shorted: function(req,res) {
    if (req.url == '/') return res.redirect('/');
    res.etagify();
    link.findOne({
      shortURL: req.param('shortURL')
    }).done(function(err, link) {
      if (!_.isObject(link)) return res.redirect('/');
      if (err) {
        return res.redirect('/');
      } else {
        link.visitors++;
        link.save(function(err) {
          if (err)  console.error('[ERROR] Can\'t save visitor at', Date(),' with err:\n',err)
        });
        res.redirect(link.originalURL);
      }
    });
  },

  info: function(req,res) {
    if (req.url == '/') return res.redirect('/');
    res.etagify();
    link.findOne({
      shortURL: req.param('shortURL')
    }).done(function(err, link) {
      if (!_.isObject(link)) return res.redirect('/');
      if (err) {
        return res.redirect('/');
      } else {
        res.view({originalURL: link.originalURL, shortURL: link.shortURL, createdAt: link.createdAt, visitors: link.visitors});
      }
    });
  },
  
  delink: function delink(req,res) {
    res.etagify();
    
    link.findOne({
      delink: req.param('delink')
    }).done(function(err, link) {
      if (!_.isObject(link)) return res.redirect('/');
      if (err) {
        return new Error(err);
      } else {
        if (link) {
          link.destroy(function(err) {
            throw new Error(err);
          });
          res.view('home/index',{message: 'Ссылка успешно удалена'});
        } else {
          res.redirect('/');
        }
      }
    });
  }
};
