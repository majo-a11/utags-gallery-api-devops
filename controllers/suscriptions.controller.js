const {pool} = require('../database');
const suscriptionController = {};

// Get all suscriptions by user with method get
suscriptionController.getSuscriptions = async (req, res) => {
    const id = req.params.id;
    const suscriptions = await pool.query('SELECT suscriptions.suscription_id,suscriptions.status, users.user_id,channels.channel_id,channels.name,channels.postquantity,channels.suscribers FROM suscriptions INNER JOIN channels ON channels.channel_id = suscriptions.channel_id INNER JOIN users ON users.user_id = suscriptions.user_id WHERE users.user_id = $1',[id]);
    if (suscriptions.rows.length>0){
        activesuscriptions = [];
        suscriptions.rows.forEach((value) => {
            if (value.status == true){
                activesuscriptions.push(value);
            }
        });
        res.json(activesuscriptions);
      }else{
        res.json({Message: 'No suscriptions found'});
    }
}


// use decorator pattern
let Like = function (number) {
    this.number = number;
    this.num = function () {
        return this.number;
    };
}

let DecoratedLike = function (number) {
   this.number = number + 1;
    this.numdecorator = function () {
        return this.number;
    };

}


function runDecorator(number) {
    let like = new Like(number);
    var valor = like.num();

    let decorated = new DecoratedLike(valor);
    return decorated.numdecorator();
}


let DecoratedLikeRest = function (number) {
    this.number = number - 1;
     this.numdecoratorRest = function () {
         return this.number;
     };
 
 }
 
 
 function runDecoratorRest(number) {
     let like = new Like(number);
     var valor = like.num();
 
     let decorated = new DecoratedLikeRest(valor);
     return decorated.numdecoratorRest();
 }


// Create new suscription with POST method
suscriptionController.postSuscription = async (req, res) => {
    const addSuscription = {user_id,channel_id} = req.body;
    const suscribers = await pool.query('SELECT suscribers FROM channels WHERE channel_id = $1',[channel_id]);
    var newsuscriber = suscribers.rows[0].suscribers;
    var newsuscriberadded = runDecorator(newsuscriber);
    pool.query('UPDATE channels SET suscribers = $1 WHERE channel_id = $2',[newsuscriberadded,addSuscription.channel_id]);
    const addSus = pool.query('INSERT INTO suscriptions (user_id,channel_id,status) VALUES ($1,$2,$3)',[addSuscription.user_id,addSuscription.channel_id,true]);
    res.json({
        Message: 'You suscript to channel successfully ',
        code: 200,
        data: addSuscription
    })
}


// Unsuscribe with method put
suscriptionController.UnSuscribeToChannel = async (req, res) =>{
    const id = req.params.id;
    const channel_id = req.body.channel_id;
    const suscribers = await pool.query('SELECT suscribers FROM channels WHERE channel_id = $1',[channel_id]);
    var restsuscriber = suscribers.rows[0].suscribers;
    var newsuscriberrest = runDecoratorRest(restsuscriber);
    pool.query('UPDATE channels SET suscribers = $1 WHERE channel_id = $2',[newsuscriberrest,channel_id]);
    const response =  pool.query('UPDATE suscriptions SET status = $1 WHERE suscription_id = $2', [false,id]);
    console.log(response);
    res.json({
        Message: 'Unsuscribe successfully ',
        code: 200,
        Ususcribe : id
    })

}



module.exports = suscriptionController;