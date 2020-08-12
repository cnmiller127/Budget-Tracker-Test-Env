
let transactions = [];
let myChart;
var dataRes;

getIndexedDBdata();
displayData();

function displayData(){
fetch("/api/transaction")
  .then(response => {
    return response.json();
  })
  .then(data => {
    // save db data on global variable
    transactions = data;

    populateTotal();
    populateTable();
    populateChart();
  });
}

function populateTotal() {
  // reduce transaction amounts to a single total value
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  let totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

function populateTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach(transaction => {
    // create and populate a table row
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}

function populateChart() {
  // copy array and reverse it
  let reversed = transactions.slice().reverse();
  let sum = 0;

  // create date labels for chart
  let labels = reversed.map(t => {
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  // create incremental values for chart
  let data = reversed.map(t => {
    sum += parseInt(t.value);
    return sum;
  });

  // remove old chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  let ctx = document.getElementById("myChart").getContext("2d");

  myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels,
        datasets: [{
            label: "Total Over Time",
            fill: true,
            backgroundColor: "#6666ff",
            data
        }]
    }
  });
}

function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  }
  else {
    errorEl.textContent = "";
  }

  // create record
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();
  
  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => {    
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      errorEl.textContent = "Missing Information";
    }
    else {
      // clear form
      nameEl.value = "";
      amountEl.value = "";
    }
  })
  .catch(err => {
    // fetch failed, so save in indexed db
    saveRecord(transaction);

    // clear form
    nameEl.value = "";
    amountEl.value = "";
  });
}

document.querySelector("#add-btn").onclick = function() {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
  sendTransaction(false);
};


function saveRecord(money){
  

  const openRequest = self.indexedDB.open("transactions", 1);
  // Create the schema
  openRequest.onupgradeneeded = function(event) {
      const db = event.target.result;
      
      const transactionsStore = db.createObjectStore("transactions", {keyPath: "_id", autoIncrement: true});
      const nameIndex = transactionsStore.createIndex("name", "name");
      const valueIndex = transactionsStore.createIndex("value", "value");
      const dateIndex = transactionsStore.createIndex("date", "date");
  };

    openRequest.onerror = function(event) {
        console.error(event);
    };

    openRequest.onsuccess = function (event) {
        const db = openRequest.result;
        const transaction = db.transaction(["transactions"], "readwrite");
        const transactionsStore = transaction.objectStore("transactions");
        const nameIndex = transactionsStore.index("name");
        const valueIndex = transactionsStore.index("value");
        const dateIndex = transactionsStore.index("date");
        console.log('DB opened');
        // Adds data to our objectStore
        console.log(money);
      transactionsStore.add({name: money.name, value: money.value, date: money.date});
      

      // Close the db when the transaction is done
      transaction.oncomplete = function() {
          db.close();
      };
  };
}

function getIndexedDBdata(){
  
  const openRequest = self.indexedDB.open("transactions", 1);
  // Create the schema
  openRequest.onupgradeneeded = function(event) {
      const db = event.target.result;
      
      const transactionsStore = db.createObjectStore("transactions", {keyPath: "_id", autoIncrement: true});
      const nameIndex = transactionsStore.createIndex("name", "name");
      const valueIndex = transactionsStore.createIndex("value", "value");
      const dateIndex = transactionsStore.createIndex("date", "date");
  };


    openRequest.onsuccess = function (event) {
        const db = openRequest.result;
        const transaction = db.transaction(["transactions"], "readwrite");
        const transactionsStore = transaction.objectStore("transactions");
        const nameIndex = transactionsStore.index("name");
        const valueIndex = transactionsStore.index("value");
        const dateIndex = transactionsStore.index("date");
        console.log('DB opened');
        // Gets data from our objectStore
        const getRequest = transactionsStore.getAll();
        getRequest.onsuccess = () => {
          console.log(getRequest.result);
          if(getRequest.result){
            transferIndexed(getRequest.result);
            }
          
        };
      
      // Close the db when the transaction is done
      transaction.oncomplete = function() {
          db.close();
      };
  };
  
}

function transferIndexed(data){
  console.log(data);
  data.forEach(index => {

  
  let transaction = {
    name: index.name,
    value: index.value,
    date: new Date().toISOString()
  };
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    clearIndexedDB(); // clear indexed DB to minimize unnecessary storage 
    return response.json();
  }).catch(err => {
    // fetch failed, so do nothing
    return;
  });
 
  })
}

function clearIndexedDB(){
  const openRequest = self.indexedDB.open("transactions", 1);
  // Create the schema
  openRequest.onupgradeneeded = function(event) {
      const db = event.target.result;
      
      const transactionsStore = db.createObjectStore("transactions", {keyPath: "_id", autoIncrement: true});
      const nameIndex = transactionsStore.createIndex("name", "name");
      const valueIndex = transactionsStore.createIndex("value", "value");
      const dateIndex = transactionsStore.createIndex("date", "date");
  };


    openRequest.onsuccess = function (event) {
        const db = openRequest.result;
        const transaction = db.transaction(["transactions"], "readwrite");
        const transactionsStore = transaction.objectStore("transactions");
        const nameIndex = transactionsStore.index("name");
        const valueIndex = transactionsStore.index("value");
        const dateIndex = transactionsStore.index("date");
        console.log('DB opened');
        // Gets data from our objectStore
        const request = transactionsStore.clear();
      
      // Close the db when the transaction is done
      transaction.oncomplete = function() {
          db.close();
          location.reload();
      }

  }
}
