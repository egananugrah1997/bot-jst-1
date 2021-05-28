var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');
const cls_model = require('./sdk/cls_model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1810565867:AAHIxGJWega34WTZI_eUDEy7Wv0RQ9npbFc'
const bot = new TelegramBot(token, {polling: true});

// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        click /predict
    );   
});

state = 0;
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai i|v contohnya 9|9`
    );  
    state = 1;
});


bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        i = S[0]
        v = S[1]
        model.predict(
        [
            parseFloat(s[0]), //string to float
            parseFloat(s[1])
        ]
        ).then((jres)=>{
        bot.sendMessage(
            msg.chat.id,
            'nilai v yang diprediksi adalah ${jres[0]) volt'
        );
        bot.sendMessage(
            msg.chat.id,
            'nilai p yang diprediksi adalah ${jres[1]) watt'
        );   
     })
 }else{
    state = 0
 }
    
})

// routes
r.get('/prediction/:i/:r', function(req, res, next) {
    model.predict(
        [
            parseFloat(req.params.i), //string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
