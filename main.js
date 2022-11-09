
// query

function httpRequest(callback) {
	var url = 'https://core-api-prod.upstairs.io/orders?page=1&page_size=99999&name=&sort=lowest&type=1';
	var xhr = new XMLHttpRequest();
	var nft_filters = localStorage.nft_filters || [];
	if (nft_filters.length) {
		nft_filters = JSON.parse(nft_filters)
		nft_filters.forEach(function(item){
			url = url + '&min_price=' + Number(item.min_price).toFixed(4) + '&max_price=' + Number(item.max_price).toFixed(4) + '&name=' + item.collection_name
			xhr.open("GET", url, true);
		
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					callback(xhr.response);
				}
			}
			xhr.send();
		})
	}
	else {
		var table = "<table><thead><tr><th>nft_id</th><th>name</th><th>price</th></tr></thead><tbody>";
		table += '</tbody></table>';
		document.getElementById('stock').innerHTML = table;
	}

}

// render

function showResult(result) {
	var table = "<table><thead><tr><th>nft_id</th><th>name</th><th>price</th></tr></thead><tbody>";
	try {
		var response = JSON.parse(result)
		response.list.forEach(function(item){
			table += '<tr>';
			table += '<td>' + item.nft_id + '</td>';
			table += '<td>' + item.name + '</td>';
			table += '<td>' + Number(item.price).toFixed(4) + ' ' + item.currency + '</td>';
			table += '</tr>';
		})
		table += '</tbody></table>';
		document.getElementById('stock').innerHTML = table;
	} catch (error) {
		console.log(error);
		table += '</tbody></table>';
		document.getElementById('stock').innerHTML = table;
	}
}


// add 

document.getElementById('addBtn').onclick = function() {
	var add = document.getElementById('add'),
		addBtn = document.getElementById('addBtn');
	
	var collection_name = document.createElement('input');
	collection_name.id = 'collection_name';
	collection_name.value = '藏品名称';


	var min_price = document.createElement('input');
	min_price.id = 'min_price';
	min_price.value = '最低价格';

	var max_price = document.createElement('input');
	max_price.id = 'max_price';
	max_price.value = '最高价格';

	var saveBtn = document.createElement('button');
	saveBtn.id = 'saveBtn';
	saveBtn.innerHTML = 'save';

	let newDiv1 = document.createElement("div");
	let newDiv2 = document.createElement("div");
	let newDiv3 = document.createElement("div");
	let newDiv4 = document.createElement("div");
	newDiv1.appendChild(collection_name);
	newDiv2.appendChild(min_price);
	newDiv3.appendChild(max_price);
	newDiv4.appendChild(saveBtn);

	add.removeChild(addBtn);
	add.appendChild(newDiv1);
	add.appendChild(newDiv2);
	add.appendChild(newDiv3);
	add.appendChild(newDiv4);

	document.getElementById('saveBtn').onclick = function() {
		var collection_name_value= document.getElementById('collection_name').value;
		var min_price_value = document.getElementById('min_price').value;
		var max_price_value = document.getElementById('max_price').value;

		var nft_filters = localStorage.nft_filters || [];
		if (nft_filters.length) {
			nft_filters = JSON.parse(nft_filters).push({"collection_name": collection_name_value, "min_price": min_price_value, "max_price": max_price_value})
		}
		else {
			nft_filters = [{"collection_name": collection_name_value, "min_price": min_price_value, "max_price": max_price_value}]
		}
		
		localStorage.nft_filters = JSON.stringify(nft_filters);

		add.removeChild(newDiv1);
		add.removeChild(newDiv2);
		add.removeChild(newDiv3);
		add.removeChild(newDiv4);
		add.appendChild(addBtn);
		httpRequest(showResult);
	}
}


// initial localStorage
httpRequest(showResult);
// initial tasks, 1 times per min
interval_id = setInterval(function(){httpRequest(showResult)}, 60000);
var nft_interval_ids = localStorage.nft_interval_ids || [];
nft_interval_ids.push(interval_id);
localStorage.nft_interval_ids = nft_interval_ids;


