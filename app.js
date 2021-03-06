//Model
//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {

        var sum = 0;
        data.allItems[type].forEach(function (item, index) {
            sum += item.value;
        });
        data.totals[type] = sum;

    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        //set -1 if something not exist
        percentage: -1
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //ID should be last index + 1
            //Create new ID

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create new Item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);

            }
            //Push it into our data structure
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },
        calculateBudget: function () {
            //1.calculate total ot incomes and total of exoenses
            calculateTotal('inc');
            calculateTotal('exp');

            //2.calculate the budget incomes-expenses
            data.budget = data.totals.inc - data.totals.exp;

            //3. caclulate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (element, index) {
                element.calcPercentage(data.totals.inc);
            });


        },
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (element, index) {
                return element.getPercentage();
            });
            return allPerc;
        },
        deleteItem: function (type, id) {
            //id = 3;
            //map() returns a new array 
            var ids, index;
            ids = data.allItems[type].map(function (element, index, array) {
                return element.id;
            });

            index = ids.indexOf(id);

            //if index = -1 this meaning that element not exist
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },
        testing: function () {
            console.log(data);
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            };
        },

    }
})();


//View
//UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };
    var formatNumber = function (number, type) {
        var intNumberSplit, decNumberSplit, numberSplit, sign;
        //format every number for UI part
        /**
         * Add + or - 
         * before number exactly 2 decimal points
         * comma separating the thousands
         * ex:
         *  2310.4567 -> +2,310.46
         *  2000 -> +2,000.00
         * 
         */
        number = Math.abs(number);
        number = number.toFixed(2);

        numberSplit = number.split('.');

        intNumberSplit = numberSplit[0];


        if (intNumberSplit.length > 3) {
            //more than 1000 
            intNumberSplit = intNumberSplit.substr(0, intNumberSplit.length - 3) + ',' + intNumberSplit.substr(intNumberSplit.length - 3, 3); //result is input 2310 -> 2,310
        }
        decNumberSplit = numberSplit[1];
        console.log(type);

        type === 'exp' ? sign = '-' : sign = '+';
        return sign + ' ' + intNumberSplit + '.' + decNumberSplit;

    };
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Inc or Exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        getDOMstrings: function () {
            return DOMstrings;
        },
        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputValue + ',' + DOMstrings.inputDescription);

            var fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (element, index, array) {
                element.value = '';
            });
            fieldsArray[0].focus();
        },
        addListItem: function (obj, type) {

            var html, newHtml, element;
            //1. Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%" ><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value" > %value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //2. Replae the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //3.Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp'
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }


        },
        deleteListItem: function (selectorID) {
            var el;
            el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);

        },
        displayPercentages: function (percentages) {
            var fields;

            //fields is node list
            fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            nodeListForEach(fields, function (element, index) {
                if (percentages[index] > 0) {
                    element.textContent = percentages[index] + '%';
                } else {
                    element.textContent = '---';
                }
            });
            /**
             * nodeListForEach(fields,function(element, index){
             *  Do things
             * })
             */

        },
        displayMonth: function () {
            var now, year, month, months;
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changeType: function () {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            nodeListForEach(fields, function (element, index) {
                element.classList.toggle('red-focus');

            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        }

    }

})();


//Controller
//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);

    };
    var updateBudget = function () {
        var budget;

        //1. calculate the budget
        budgetCtrl.calculateBudget();
        //2. return the budget
        budget = budgetCtrl.getBudget();

        //3. display the budget
        console.log(budget);
        UICtrl.displayBudget(budget);

    };
    var updatePercentages = function () {

        //1.calcutlate the percentages
        budgetCtrl.calculatePercentages()

        //2.read from the budgetController
        var percentages = budgetCtrl.getPercentages();

        //3.Update the UI with new percentages
        UICtrl.displayPercentages(percentages);

    };
    var ctrlAddItem = function () {
        var input, newItem;
        //1. get input data
        input = UICtrl.getInput();

        //Some validation
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. add new item to the UI
            UIController.addListItem(newItem, input.type);
            //4. clear the inputs
            UIController.clearFields();
            //5.Calculate and update the budget
            updateBudget();
            //6.Update and calculate percentages
            updatePercentages();
        }

    };
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1.Delete Item from data structure
            budgetCtrl.deleteItem(type, ID);
            //2.Delete the Item from the UI 
            UICtrl.deleteListItem(itemID);

            //3.Update and show the new budget
            updateBudget();
            //4.Update and calculate percentages
            updatePercentages();
        }

    };

    return {
        init: function () {
            console.log('App has started');

            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
            UICtrl.displayMonth();
        }
    }

})(budgetController, UIController);

controller.init();