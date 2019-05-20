var store = {

	get: function() 
	{
		if(!arguments[0]){
			return false;
		}
		var name = arguments[0],
			data = this._read(name);
		if(arguments[1]){
			for(var i in data){
				if(data[i][data[i]["primary_key"]] == arguments[1]){
					return data[i];
				}
			}
			return {};
		}else{
			return data;
		}
	},


	set: function(){

		if(!arguments[1]){
			return false;
		}

		var name = arguments[0],
			val = arguments[1];

		var oldData = this._read(name);

		if(oldData){
			var setItem = false;
			for(var i in oldData){
				if(oldData[i][oldData[i]["primary_key"]] ==  val[val["primary_key"]]){
					setItem = true;
					oldData[i] = val;
				}
			}
			if(setItem){
				this._save(name, oldData );
			}else{
				this._save(name, [val].concat(oldData) );
			}
		}else{
			this._save(name, [val])
		}
	},

	remove: function() {
		var name = arguments[0];
		if(arguments[1]){
			var data = this._read(name),
				unique = arguments[1],
				newData = [];
			for(var i in data){
				if(data[i][data[i]["primary_key"]] != unique){
					newData.push(data[i]);
				}
			}
			this._save(name, newData);
		}else{
			localStorage.removeItem(name);
		}
	},


	_parse: function(strVal) {
		var val = ''
		try { val = JSON.parse(strVal) }
		catch(e) { val = strVal }
		return (val !== undefined && val !== null ? val : []);
	},
	_read:function(){
		var data = this._parse(localStorage.getItem(arguments[0]) ),
			newDate = [];
		if(data){
			var currentTime = new Date().getTime();
			for(var i in data){
				if(!(data[i]["delTime"] && data[i]["delTime"] < currentTime)){
					newDate.push(data[i]);	
				}
			}
			return newDate;
		}else{
			return data;
		}
	},
	_save: function(){
		localStorage.setItem(arguments[0], JSON.stringify(arguments[1]));
	}
}