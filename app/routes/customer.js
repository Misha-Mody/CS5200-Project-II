let express = require("express");
let router = express.Router();

const myDB = require("../db/MySqliteDBCustomer");

/* GET home page. */
router.get("/", async function (req, res, next) {
    const customers = await myDB.getCustomers();
    res.render("customers", { customers });
});

router.get("/add", async function (req, res, next) {
    const cuisines = await myDB.getCuisines();
    const paymentMethods = await myDB.getPaymentMethods();
    const dressCodes = await myDB.getDressCodes();
    res.render('add-customer', { cuisines, paymentMethods, dressCodes });
});

router.post("/add", async function (req, res, next) {
    console.log('test', req.body);

    if (!req.body.name) {
        next({ message: "Please provide a name for the customer" });
        return
    }

    const customer = {
        name: req.body.name,
        smoker: req.body.smoker === 'smoker' ? 1 : 0,
        drinkLevel: req.body.drinkLevel,
        dressCodeID: parseInt(req.body.dressCode),
        ambience: req.body.ambience,
        budget: req.body.budget,
        paymentMethods: req.body.paymentMethod,
        cuisines: req.body.cuisine
    };

    console.log('customer', customer);

    try {
        const insertCustomer = await myDB.insertCustomer(customer);
        console.log("Inserted", insertCustomer);
        res.redirect('/customer');
    } catch (err) {
        console.log("Error inserting", err);
        next(err);
    }
});

module.exports = router;
