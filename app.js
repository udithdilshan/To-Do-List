const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('view engine', 'ejs');
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const itemsSchema = {
    name: {
        type: String,
        required: [true, "Item Name required"]
    }
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your To Do List!"
})

const item2 = new Item({
    name: "Hit the + button to add the new item."
})

const item3 = new Item({
    name: "<--- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];

Item.find({}, function (err, foundItems) {

})

const workItems = []
app.get('/', function (req, res) {
    Item.find(function (err, items) {
        if (items.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                console.log(err ? err : "All default items are added succesfully!");
            });
            res.redirect('/')
        } else {
            res.render("list", {
                title: "Today",
                newListItems: items
            })
        }
    }).select({
        __v: 0
    })
});
app.post('/', function (req, res) {
    const itemName = req.body.item;
    
    if (req.body.list === "Work List") {
        workItems.push(item)
        res.redirect("/work")
    } else {
        const item= new Item({
            name:itemName
        })
        item.save()
        res.redirect("/")
    }
})

app.get("/:customListName",function(req,res){
    res.render('list',{
        title: req.params.customListName+" List",
        newListItems:defaultItems
    })
})



/* 
app.get("/work", function (req, res) {
    res.render('list', {
        title: "Work List",
        newListItems: workItems
    })
})
 */
app.post("/work", function (req, res) {
    workItems.push(req.body.item)
    res.redirect("/work")
})

app.get("/about", function (req, res) {
    res.render("about")
})

app.post("/delete",function(req,res){
    Item.findByIdAndRemove(req.body.checkbox,function(err){
        console.log(err?err:"Item remove successfuly");
    })
    res.redirect("/")
});

app.listen(3000, () => console.log("Server started on port 3000"));