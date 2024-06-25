var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvlabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    precentageLabel : ".budget__expenses--percentage"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // exp, inc
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value) 
      };
    },

    getDOMstrings: function() {
      return DOMstrings;
    },
    //  Энэ function маань хэрэглэгч барааг оруулах үед талбарыг устгаж шинээр эхлүүлэх
    clearFields : function(){
      var fields = document.querySelectorAll(DOMstrings.inputDescription +
          ", " + DOMstrings.inputValue);
      //Convert list to array
      var fieldArr = Array.prototype.slice.call(fields);
      fieldArr.forEach(function(el, index , array){
          el.value = "";
      });
       fieldArr[0].focus();
    },

    tusviigUzuuleh: function(tusuv){
      document.querySelector(DOMstrings.tusuvlabel).textContent = tusuv.tusuw;
      document.querySelector(DOMstrings.incomeLabel).textContent = tusuv.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent = tusuv.totalExp;

      if (tusuv.huvi !== 0){
        document.querySelector(DOMstrings.precentageLabel).textContent = tusuv.huvi + "%";
      }else {
        document.querySelector(DOMstrings.precentageLabel).textContent = tusuv.huvi;
      }
     
    },
    addListItem: function(item, type) {

      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);

      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    }
  };
})();


var financeController = (function() {
  // private data
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // private data
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.items[type].forEach(function(el){
    sum = sum + el.value;
    });

    data.totals[type] = sum;
      }
  // private data
  var data = {
    items: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },

    tusuv : 0,
    huvi: 0
  };

  return {
    tusuvTootsooloh: function(){
      calculateTotal('inc')
      calculateTotal('exp')

      data.tusuv = data.totals.inc - data.totals.exp;

      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100)
    },

    tusuviigAvah: function(){
      return {
        tusuw: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      };
    },

    addItem: function(type, desc, val) {
      var item, id;

    if (data.items[type].length > 0) {
              id = data.items[type][data.items[type].length - 1].id + 1;
          } else {
              id = 1;
          }
      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item; 	
    },

    seeData: function() {
      return data;
    }
  };
})();

var appController = (function(uiController, financeController) {
  var ctrlAddItem = function() {

    var input = uiController.getInput();
    if(input.description !== "" && input.value !== ""){
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );

      uiController.addListItem(item, input.type);
      uiController.clearFields();
    }
    
    // Төсөв тооцоолох
    financeController.tusuvTootsooloh();

    //Эцсийн үлдэгдэл , тооцоог дэлгэцэнд гаргана.
    var tusuv  = financeController.tusuviigAvah();

    //Дэлгэцэнд гаргана.
    uiController.tusviigUzuuleh(tusuv);
  };

  var setupEventListeners = function() {
    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function() {
      console.log("Application started...");
      uiController.tusviigUzuuleh({
        tusuw: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0
      });
      setupEventListeners();
    }
  };
})(uiController, financeController);

appController.init();