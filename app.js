const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('view engine', 'ejs');
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
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

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

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
    const listName = req.body.list
    const item = new Item({
        name: itemName
    })

    if (req.body.list === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: listName
        }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName)
        })
    }
})

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({
        name: customListName
    }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName)
            } else {
                res.render('list', {
                    title: foundList.name,
                    newListItems: foundList.items
                });
            }
        } else {
            console.log("Error when list search");
        }
    })
})

app.get("/about", function (req, res) {
    res.render("about")
})

app.post("/delete", function (req, res) {
    const chechedItemId = req.body.checkboxId;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(chechedItemId, function (err) {
            console.log(err ? err : "Item remove successfuly");
        })
        res.redirect("/")
    } else {
        List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                items: {
                    _id: chechedItemId
                }
            }
        }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName)
            }
        })
    }
});

app.listen(3000, () => console.log("Server started on port 3000"));