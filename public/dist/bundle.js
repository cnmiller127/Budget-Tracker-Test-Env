/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/index.js":
/*!*************************!*\
  !*** ./public/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var transactions = [];\nvar myChart;\nvar dataRes;\ngetIndexedDBdata();\nfetch(\"/api/transaction\").then(function (response) {\n  return response.json();\n}).then(function (data) {\n  // save db data on global variable\n  transactions = data;\n  populateTotal();\n  populateTable();\n  populateChart();\n});\n\nfunction populateTotal() {\n  // reduce transaction amounts to a single total value\n  var total = transactions.reduce(function (total, t) {\n    return total + parseInt(t.value);\n  }, 0);\n  var totalEl = document.querySelector(\"#total\");\n  totalEl.textContent = total;\n}\n\nfunction populateTable() {\n  var tbody = document.querySelector(\"#tbody\");\n  tbody.innerHTML = \"\";\n  transactions.forEach(function (transaction) {\n    // create and populate a table row\n    var tr = document.createElement(\"tr\");\n    tr.innerHTML = \"\\n      <td>\".concat(transaction.name, \"</td>\\n      <td>\").concat(transaction.value, \"</td>\\n    \");\n    tbody.appendChild(tr);\n  });\n}\n\nfunction populateChart() {\n  // copy array and reverse it\n  var reversed = transactions.slice().reverse();\n  var sum = 0; // create date labels for chart\n\n  var labels = reversed.map(function (t) {\n    var date = new Date(t.date);\n    return \"\".concat(date.getMonth() + 1, \"/\").concat(date.getDate(), \"/\").concat(date.getFullYear());\n  }); // create incremental values for chart\n\n  var data = reversed.map(function (t) {\n    sum += parseInt(t.value);\n    return sum;\n  }); // remove old chart if it exists\n\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  var ctx = document.getElementById(\"myChart\").getContext(\"2d\");\n  myChart = new Chart(ctx, {\n    type: 'line',\n    data: {\n      labels: labels,\n      datasets: [{\n        label: \"Total Over Time\",\n        fill: true,\n        backgroundColor: \"#6666ff\",\n        data: data\n      }]\n    }\n  });\n}\n\nfunction sendTransaction(isAdding) {\n  var nameEl = document.querySelector(\"#t-name\");\n  var amountEl = document.querySelector(\"#t-amount\");\n  var errorEl = document.querySelector(\".form .error\"); // validate form\n\n  if (nameEl.value === \"\" || amountEl.value === \"\") {\n    errorEl.textContent = \"Missing Information\";\n    return;\n  } else {\n    errorEl.textContent = \"\";\n  } // create record\n\n\n  var transaction = {\n    name: nameEl.value,\n    value: amountEl.value,\n    date: new Date().toISOString()\n  }; // if subtracting funds, convert amount to negative number\n\n  if (!isAdding) {\n    transaction.value *= -1;\n  } // add to beginning of current array of data\n\n\n  transactions.unshift(transaction); // re-run logic to populate ui with new record\n\n  populateChart();\n  populateTable();\n  populateTotal(); // also send to server\n\n  fetch(\"/api/transaction\", {\n    method: \"POST\",\n    body: JSON.stringify(transaction),\n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    }\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.errors) {\n      errorEl.textContent = \"Missing Information\";\n    } else {\n      // clear form\n      nameEl.value = \"\";\n      amountEl.value = \"\";\n    }\n  })[\"catch\"](function (err) {\n    // fetch failed, so save in indexed db\n    saveRecord(transaction); // clear form\n\n    nameEl.value = \"\";\n    amountEl.value = \"\";\n  });\n}\n\ndocument.querySelector(\"#add-btn\").onclick = function () {\n  sendTransaction(true);\n};\n\ndocument.querySelector(\"#sub-btn\").onclick = function () {\n  sendTransaction(false);\n};\n\nfunction saveRecord(money) {\n  var openRequest = self.indexedDB.open(\"transactions\", 1); // Create the schema\n\n  openRequest.onupgradeneeded = function (event) {\n    var db = event.target.result;\n    var transactionsStore = db.createObjectStore(\"transactions\", {\n      keyPath: \"_id\",\n      autoIncrement: true\n    });\n    var nameIndex = transactionsStore.createIndex(\"name\", \"name\");\n    var valueIndex = transactionsStore.createIndex(\"value\", \"value\");\n    var dateIndex = transactionsStore.createIndex(\"date\", \"date\");\n  };\n\n  openRequest.onerror = function (event) {\n    console.error(event);\n  };\n\n  openRequest.onsuccess = function (event) {\n    var db = openRequest.result;\n    var transaction = db.transaction([\"transactions\"], \"readwrite\");\n    var transactionsStore = transaction.objectStore(\"transactions\");\n    var nameIndex = transactionsStore.index(\"name\");\n    var valueIndex = transactionsStore.index(\"value\");\n    var dateIndex = transactionsStore.index(\"date\");\n    console.log('DB opened'); // Adds data to our objectStore\n\n    console.log(money);\n    transactionsStore.add({\n      name: money.name,\n      value: money.value,\n      date: money.date\n    }); // Close the db when the transaction is done\n\n    transaction.oncomplete = function () {\n      db.close();\n    };\n  };\n}\n\nfunction getIndexedDBdata() {\n  var openRequest = self.indexedDB.open(\"transactions\", 1); // Create the schema\n\n  openRequest.onupgradeneeded = function (event) {\n    var db = event.target.result;\n    var transactionsStore = db.createObjectStore(\"transactions\", {\n      keyPath: \"_id\",\n      autoIncrement: true\n    });\n    var nameIndex = transactionsStore.createIndex(\"name\", \"name\");\n    var valueIndex = transactionsStore.createIndex(\"value\", \"value\");\n    var dateIndex = transactionsStore.createIndex(\"date\", \"date\");\n  };\n\n  openRequest.onsuccess = function (event) {\n    var db = openRequest.result;\n    var transaction = db.transaction([\"transactions\"], \"readwrite\");\n    var transactionsStore = transaction.objectStore(\"transactions\");\n    var nameIndex = transactionsStore.index(\"name\");\n    var valueIndex = transactionsStore.index(\"value\");\n    var dateIndex = transactionsStore.index(\"date\");\n    console.log('DB opened'); // Gets data from our objectStore\n\n    var getRequest = transactionsStore.getAll();\n\n    getRequest.onsuccess = function () {\n      console.log(getRequest.result);\n\n      if (getRequest.result) {\n        transferIndexed(getRequest.result);\n      }\n    }; // Close the db when the transaction is done\n\n\n    transaction.oncomplete = function () {\n      db.close();\n    };\n  };\n}\n\nfunction transferIndexed(data) {\n  console.log(data);\n  data.forEach(function (index) {\n    var transaction = {\n      name: index.name,\n      value: index.value,\n      date: new Date().toISOString()\n    };\n    fetch(\"/api/transaction\", {\n      method: \"POST\",\n      body: JSON.stringify(transaction),\n      headers: {\n        Accept: \"application/json, text/plain, */*\",\n        \"Content-Type\": \"application/json\"\n      }\n    }).then(function (response) {\n      clearIndexedDB(); // clear indexed DB to minimize unnecessary storage    \n\n      return response.json();\n    })[\"catch\"](function (err) {\n      // fetch failed, so do nothing\n      return;\n    });\n  });\n}\n\nfunction clearIndexedDB() {\n  var openRequest = self.indexedDB.open(\"transactions\", 1); // Create the schema\n\n  openRequest.onupgradeneeded = function (event) {\n    var db = event.target.result;\n    var transactionsStore = db.createObjectStore(\"transactions\", {\n      keyPath: \"_id\",\n      autoIncrement: true\n    });\n    var nameIndex = transactionsStore.createIndex(\"name\", \"name\");\n    var valueIndex = transactionsStore.createIndex(\"value\", \"value\");\n    var dateIndex = transactionsStore.createIndex(\"date\", \"date\");\n  };\n\n  openRequest.onsuccess = function (event) {\n    var db = openRequest.result;\n    var transaction = db.transaction([\"transactions\"], \"readwrite\");\n    var transactionsStore = transaction.objectStore(\"transactions\");\n    var nameIndex = transactionsStore.index(\"name\");\n    var valueIndex = transactionsStore.index(\"value\");\n    var dateIndex = transactionsStore.index(\"date\");\n    console.log('DB opened'); // Gets data from our objectStore\n\n    var request = transactionsStore.clear();\n\n    request.onsuccess = function () {\n      console.log(request.result);\n    }; // Close the db when the transaction is done\n\n\n    transaction.oncomplete = function () {\n      db.close();\n    };\n  };\n}\n\n//# sourceURL=webpack:///./public/index.js?");

/***/ })

/******/ });