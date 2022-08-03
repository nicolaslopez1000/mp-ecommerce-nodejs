const { query } = require('express');
var express = require('express');
var exphbs = require('express-handlebars');
var port = process.env.PORT || 3000

var app = express();
const siteUrl = 'http://127.0.0.1:3000/'

const mercadopago = require('mercadopago');
// Add Your credentials
mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',

});


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.post('/', function (req, res) {
    
    res.sendStatus(200);
 
});

app.get('/detail', async function (req, res) {
    var query = req.query
    //console.log(query)
    // Create a preference object



    let preference = {
        items: [
            {
                id: '1234',
                title: query.title,
                picture_url: siteUrl + query.img, 
                unit_price: parseInt(query.price),
                quantity: 1,
            }
        ],
        external_reference: 'nicolaslopez1000@hotmail.com',
        back_urls: {
            success: siteUrl + 'success',
            pending: siteUrl + 'pending',
            failure: siteUrl + 'failure'
        },
        auto_return: "all",
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_63274575@testuser.com",
            phone: {
                area_code: "11",
                number: 098674104
            },
            address: {
                street_name: "Falsa",
                street_number: 123,
                zip_code: "11300"
            }
        },
        payment_methods: {
            installments:6,
            excluded_payment_methods: 'visa'
        },
        notification_url: siteUrl + 'payment'
    };

    var preference_id = await mercadopago.preferences.create(preference)
        .then(function (response) {
            // This value replaces the String "<%= global.id %>" in your HTML
            return response.body.id
            //console.log(response.body)
        }).catch(function (error) {
            console.log(error);
        });

    query.preference_id = preference_id


    res.render('detail', query);
});

app.get('/success', function (req, res) {
    var query = req.query
    res.render('state', query);});

app.get('/pending', function (req, res) {
    var query = req.query
    res.render('state', query);
});

app.get('/failure', function (req, res) {
    var query = req.query
    res.render('state', query);});

app.listen(port);