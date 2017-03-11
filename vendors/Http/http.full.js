let $http = url => {
	let ajax = (method, options = {}) => {
		return new Promise((resolve, reject) => {
			let client = new XMLHttpRequest(), params = [];

			client.addEventListener("load", () => (client.status >= 200 && client.status < 300) ? resolve(client.response, client) : reject(client));

			if ( options.data ) {
				for (var key in options.data) { 
					if(options.data.hasOwnProperty(key)) { 
						params.push(encodeURI(key) + "=" + encodeURI(options.data[key])); 
					} 
				}
				
				url += "?" + params.join("&");
			}

			client.addEventListener("error", () => reject(client));
			
			client.open(method, url);

			if ( options.data ) {
				client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			}
			
			if ( options.headers ) {
				options.headers.forEach(h => {
					let k = Object.keys(h)[0];
					client.setRequestHeader(k, h[k]);
				});
			}

			client.send();			
		});	
	},
	methods = {};
	
	["get", "post", "put", "delete"].forEach(m => methods[m] = (o => ajax(m,o)));

	return methods;
};

module.exports = $http;