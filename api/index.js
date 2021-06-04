var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');
const cls_model = require('./sdk/cls_model.js');


// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1810565867:AAHIxGJWega34WTZI_eUDEy7Wv0RQ9npbFc'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome..\n
        click /predict` 
    );  
    state = 0;
});

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
        model.predict(
            [
                        parseFloat(s[0]),
                        parseFloat(s[1])
            ]
        ).then((jres1)=>{
            console.log(jres1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(jres1[0]), parseFloat(jres1[1])]).then((jres2)=>{
                bot.sendMessage(
                        msg.chat.id,
                        `nilai v yang diprediksi adalah ${jres1[0]} volt`     
                );
                bot.sendMessage(
                    msg.chat.id,
                    `nilai p yang diprediksi adalah $${jres1[1]} watt`
                );
                bot.sendMessage(
                        msg.chat.id,
                        `Klasifikasi Tegangan ${jres2}`  
        
                );
                state = 0;
        })
        
     })
 }else{
     bot.sendMessage(
         msg.chat.id,
         `please click /start`
         );
     state = 0;
 }
    
})

// routes
r.get('/predict/:i/:r', function(req, res, next) {
    model.predict(
        [
            parseFloat(req.params.i), //string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

r.get('/classify/:i/:r', function(req, res, next) {
    model.predict(
        [
            parseFloat(req.params.i), //string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.i), //string to float
                parseFloat(req.params.r),
                parseFloat(jres[0]), //string to float
                parseFloat(jres[1])
            ]
         ).then((jres)=>{
             res.json({jres, jres_})
         })
    })
});

module.exports = r;
