const express = require('express');
const bodyParser = require('body-parser');
const date=require(__dirname+"/date.js")
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static("public"))

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = []
app.get('/', function (req, res) {

    res.render("list", {
        title: date.getDate(),
        newListItems: items
    })
});
app.post('/', function (req, res) {
    item = req.body.item;
    if (req.body.list === "Work List") {
        workItems.push(item)
        res.redirect("/work")
    } else {
        items.push(item)
        res.redirect("/")
    }
})

app.get("/work", function (req, res) {
    res.render('list', {title: "Work List", newListItems: workItems})
})

app.post("/work", function (req, res) {
    workItems.push(req.body.item)
    res.redirect("/work")
})

app.get("/about",function (req,res) {
    res.render("about")
})



app.listen(3000, () => console.log("Server started on port 3000"));