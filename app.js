//Storage Controller
const StorageCtrl = (function(){
    //Public Methods
    return{
        storeItem: function(item){
            
            //localStorage can only hold strings, so before we put an array of objects there, we have to turn it into a string (using json.stringify) and when pull it out we need to turn it back into an object (using json.parse)
            let items ;
            //Check if any items in local storage
            if(localStorage.getItem('items')===null){
                items=[];
                //push the new item
                items.push(item);
                //set local storage 
                localStorage.setItem('items',JSON.stringify(items));
            } else{
                //Get what is already in localStorage
                items = JSON.parse(localStorage.getItem('items'));

                //Push the new item
                items.push(item);

                //Reset local storage 
                localStorage.setItem('items',JSON.stringify(items));

            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items')===null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(updatedItem.id===item.id){
                    items.splice(index,1,updatedItem);
                }   
            });
            //Reset local storage 
            localStorage.setItem('items',JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(id===item.id){
                    items.splice(index,1);
                }   
            });
            //Reset local storage 
            localStorage.setItem('items',JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            
            localStorage.removeItem('items');
        }

    }

})();


//Item Controller
const ItemCtrl = (function(){
    //Item Constructor 
    const Item = function(id,name,calories){
        this.id = id; //With any constructor we need to set 'this' dot and then the property to the property being passed in 
        this.name = name;
        this.calories = calories;
    }
    //Data Structure / State
    const data = {
        //items : [ 
            //An array of objects and each one will have an Id, name and calories
            // {id: 0, name: 'Chicken Dinner', calories :1200},
            // {id: 1, name: 'Cookie', calories :500},
            // {id: 2, name: 'Eggs', calories :400},
        //], 
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null, //When I click update, I want that item to be the current item, that's going to be put up in the form to be updated
        totalCalories: 0
    }
    //Public methods
    return {
        getItems :function(){
            return data.items;
        },
        addItem: function(name,calories){
            let ID;
            //Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id +1;
            } else{
                ID = 0;
            }

            //Calories to number
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(ID,name,calories);
            //Add to items array
            data.items.push(newItem);
            
            return newItem;
        },
        getItemById: function(id){
            let found = null;

            //Loop through items 
            data.items.forEach(function(item){
                if(item.id===id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name,calories){

            //Convert calories to a number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id===data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;

                }
            });
            return found;

        },
        deleteItem: function(id){
            //Get ids
            const ids = data.items.map(function(item){
                return item.id
            }); 
            //Get index
            const index = ids.indexOf(id);
            //Remove item
            data.items.splice(index,1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            //loop through items and add cals
            data.items.forEach(function(item){
                total +=item.calories;

            });

            //set total calories in data structure
            data.totalCalories = total;

            //Return Total
            return data.totalCalories;

        },
        logData : function(){
            return data;
        }
    }
})();


//UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput :'#item-calories',
        totalCalories: '.total-calories'
    }
    //Public methods
    return{
        populateItemList: function(items){
            let html='';
            items.forEach(function(item){
                html+= `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
            });
            
            //Insert List items
            document.querySelector(UISelectors.itemList).innerHTML= html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item){
            //Show the list
            document.querySelector(UISelectors.itemList).style.display='block';
            //Create li element 
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //Add id
            li.id = `item-${item.id}`;
            //Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li)
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems); //This will give us a node list and we cannot loop through using forEach, so we need to convert this into an array

            //Turn node list into an array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID===`item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML=`<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();  
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value='';
            document.querySelector(UISelectors.itemCaloriesInput).value='';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value=ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value=ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent= totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors; 
        }
    }
})();


//Main APP Controller
    const App = (function(ItemCtrl, StorageCtrl, UICtrl){//Inserting all controllers into the main controller, anything which we want to load when the application runs goes here
        //Load Event Listeners
        const loadEventListerners = function(){
            //Get UI selectors
            const UISelectors= UICtrl.getSelectors();  

            //Add item event
            document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
            
            //Disable submit on enter
            document.addEventListener('keypress',function(e){ //to check for what key was pressed
                if(e.keyCode ===13 || e.which ===13){//13 is the code for enter key
                e.preventDefault();// we're basically displabling the enter key
                return false;

                }
            });
            //Edit icon click event
            document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

            //Update item event
            document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

            //Delete item event
            document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
            
            //Back button event
            document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

            //Clear items event
            document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
        }

        //Add item submit     
        const itemAddSubmit = function(e){
            
            //Get form input from UICtrl
            const input = UICtrl.getItemInput();
            
            //Check for name and calories input
            if(input.name !=='' && input.calories!==''){
                //Add item
                const newItem = ItemCtrl.addItem(input.name, input.calories);
                //Add item to UI list
                UICtrl.addListItem(newItem);

                //Get the total caories
                const totalCalories = ItemCtrl.getTotalCalories();

                //Add total calories to the UI
                UICtrl.showTotalCalories(totalCalories);

                //Store in localStorage
                StorageCtrl.storeItem(newItem); 
                //Clear fields
                UICtrl.clearInput();
            }   

            e.preventDefault();
        }

        //Click edit item
        const itemEditClick = function(e){
            //console.log('ye test hai');//If i click anywhere on the list table, the console log will happen, so in order to prevent that we gotta use event delegation
            if(e.target.classList.contains('edit-item')){
                //console.log('ye sahi hai');
                //we want to fill the current state item with this item that we click so that we can use this in the edit state

                //Get list item id
                const listId= e.target.parentNode.parentNode.id;
                
                //Break into an array, we're going to split the id at the dash '-', so that one array is the item and one array is the number
                const listIdArr = listId.split('-');

                //Get the actual id
                const id = parseInt(listIdArr[1]);

                //Get item
                const itemToEdit = ItemCtrl.getItemById(id);
                // console.log(itemToEdit) //item grab kiya jispe operation karna hai

                //Set current item
                ItemCtrl.setCurrentItem(itemToEdit);

                //Add item to form
                UICtrl.addItemToForm(); //we don't have to pass anything to the function, because the currentitem variable already has it

            }
            e.preventDefault();
        }
        //Update item submit
        const itemUpdateSubmit = function(e){
            //Get item input
            const input = UICtrl.getItemInput();

            //Update item
            const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

            //Update UI
            UICtrl.updateListItem(updatedItem);

            //Get the total caories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            //Update local storage
            StorageCtrl.updateItemStorage(updatedItem);
            UICtrl.clearEditState();
            e.preventDefault();
        }

        const itemDeleteSubmit = function(e){
            
            //Get current item
            const currentItem = ItemCtrl.getCurrentItem();
            //Delete from data structure
            ItemCtrl.deleteItem(currentItem.id);

            //Delete from UI
            UICtrl.deleteListItem(currentItem.id);
            //Get the total caories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            //Delete from local storage
            StorageCtrl.deleteItemFromStorage(currentItem.id);

            UICtrl.clearEditState();
            e.preventDefault();
        }

        //Clear items event
        const clearAllItemsClick = function(){
            //Delete all items from data structure
            ItemCtrl.clearAllItems();

            //Get the total caories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);
            
            //Remove from UI
            UICtrl.removeItems();
            //Clear from local Storage
            StorageCtrl.clearItemsFromStorage();

            //Hide the UL(unordered list ki line)
            UICtrl.hideList();

        }
        //Public methods
        return{
            init:function(){

                //Clear Edit state / set initial state
                UICtrl.clearEditState();
                
                //Fetch items from data structure
                const items = ItemCtrl.getItems();

                //Check if any items 
                if(items.length===0){
                    UICtrl.hideList();
                } else{
                    //Populate list with items
                    UICtrl.populateItemList(items);
                }
                //get the total caories
                const totalCalories = ItemCtrl.getTotalCalories();

                //Add total calories to the UI
                UICtrl.showTotalCalories(totalCalories);
                //Load event listeners
                loadEventListerners();
            }
        }
        
    })(ItemCtrl, StorageCtrl, UICtrl);




    //When we add an item, we need an Item constructor , so that when we create an item, we can add it to the state or the data structure 
    //Each time we add some meal, its going to have an Id

//Initializing APP
App.init();

