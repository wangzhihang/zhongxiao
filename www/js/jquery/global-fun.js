function xoption2str(str){
	var newStr="",strtemp = str.split("0891")[1].substr(0,14);
	for(var i=0;i<14;){
		newStr += strtemp[i+1] + strtemp[i];
		i = i+2;
	}
	return newStr.substring(0,newStr.length-1);
}


function swap2str(str){
	var newStr="";
	for(var i=0;i<str.length;){
		newStr += str[i+1] + str[i];
		i = i+2;
	}
	return newStr.replace(/[^\d]/g, "");
}

//合并对象
 function extend(target, source) {
    for (var obj in source) {
        target[obj] = source[obj];
    }
    return target;
}

// 判断是否为空对象
function isEmptyObject(obj){
	for(var key in obj){
		return false
	};
	return true
};


function empty_global(){
	for(var i in telInfo){
		telInfo[i] = "";
	}
	empty_authentication()
}
function empty_authentication(){
	for(var i in authentication){
		authentication[i] = "";
	}
}
function empty_filterSelect(){
	for(var i in filterSelect){
		filterSelect[i] = "";
	}
}

// 去重(判断数组中是否包含值)
function arrayContains(arr, str){
	for (i in arr) {
		if (arr[i] == str) return true;
	}
	return false;
}


function trim(s){
	return s.replace(/^\s+|\s+$/g,"").replace(/[\r\n\t]/g, "");
}


function sprintf(){
	var str = arguments[0];
	var obj = arguments[1];
	for (var p in obj){
		str = str.replace(new RegExp("\\{" + p + "\\}", "g"), obj[p]);
	}
	return str;
}

function telFormat(input, maxlen, Arr){

	if(!maxlen){
		maxlen = 11;
	}

	if(!Arr){
		Arr = [2,6]
	}

	var tel_numear = String(input).replace(/[^\d]/g, "");
	if (tel_numear.length < maxlen){maxlen = tel_numear.length;}
	var temp = "";
	for (var i = 0; i < maxlen; i++) {
		temp = temp + tel_numear.substring(i, i + 1);
		for(var ii in Arr){
			if(i=== Number(Arr[ii]) && maxlen > Number(Arr[ii])+1){
				temp = temp + " ";
			}
		}
	}
	return temp;
}


function stringFormat(input, maxlen, Arr){

	if(!maxlen){
		maxlen = 11;
	}

	if(!Arr){
		Arr = [2,6]
	}

	var tel_numear = String(input).replace(/[^\d\w]/g, "");
	if (tel_numear.length < maxlen){maxlen = tel_numear.length;}
	var temp = "";
	for (var i = 0; i < maxlen; i++) {
		temp = temp + tel_numear.substring(i, i + 1);
		for(var ii in Arr){
			if(i=== Number(Arr[ii]) && maxlen > Number(Arr[ii])+1){
				temp = temp + " ";
			}
		}
	}
	return temp;
}



function convertImgToBase64(base64){
	var canvas = document.createElement('CANVAS'); 
	var ctx = canvas.getContext('2d'); 
	var img = new Image; 
	img.crossOrigin = 'Anonymous';
	img.src = base64;

	img.onload = function(){
		var width = img.width;
		var height = img.height;
		var rate = (width<height ? width/height : height/width)/1;
		canvas.width = width*rate;
		canvas.height = height*rate;
		ctx.drawImage(img,0,0,width,height,0,0,width*rate,height*rate); 
		authentication["idHeadImg"] = canvas.toDataURL('image/jpeg', 0.3);
	}
}


// 图片切一半
function canvasCutHalf(base64){
	var canvas = document.createElement('CANVAS'); 
	var ctx = canvas.getContext('2d'); 
	var img = new Image; 
	img.crossOrigin = 'Anonymous';
	img.src = base64;

	img.onload = function(){
		var width = img.width;
		var height = img.height;
		canvas.width = width/2;
		canvas.height = height/5*3;
		ctx.drawImage(img,0,0,width,height,(0-width/2),(0-height/5),width,height); 
		// authentication["idHeadImg"] = canvas.toDataURL('image/jpeg', 0.6);
		camera_authentication["list"]["idHeadImg"] = canvas.toDataURL('image/jpeg', 0.6);
	}
}



function deepCopy(obj)
{
	var o,i,j;
	if(typeof(obj)!="object" || obj===null)return obj;
	if(obj instanceof(Array)){
		o=[];
		i=0;j=obj.length;
		for(;i<j;i++){
			if(typeof(obj[i])=="object" && obj[i]!=null){
				o[i]=arguments.callee(obj[i]);
			}
			else{
				o[i]=obj[i];
			}
		}
	}
	else{
		o={};
		for(i in obj){
			if(typeof(obj[i])=="object" && obj[i]!=null){
				o[i]=arguments.callee(obj[i]);
			}
			else{
				o[i]=obj[i];
			}
		}
	}
	return o;
}



// 从数组中，删除另一个数组的内容
function Array2delArray(){
	var output = [],
		originalArray = arguments[0],	// 原始数组
		delArray = arguments[1],		// 删除数组
		key = arguments[2];				// 如果原始数组的值为对象，此值可对于对象的KEY
	for (var i in originalArray) {
		if(key){
			if (delArray.indexOf(originalArray[i][key]) === -1) {
				output.push(originalArray[i]); 
			}
		}else{
			if (delArray.indexOf(originalArray[i]) === -1) {
				output.push(originalArray[i]); 
			}
		}
	}
	return output; 
};

// 删除空数组
function arrayDelEmpty(){
	var arr = arguments[0],
		output = [];
	for(var i in arr){
		if(!(arr[i] === "" || arr[i] === undefined || arr === null)){
			output.push(arr[i])
		}
	}
	return output;
}


// 替换指定字符(全部)
function replaceAll() {
	var OriginalText = arguments[0],	// 原始字符串
		FindText = arguments[1],		// 查找字符串
		RepText = arguments[2];			// 替换字符串
	if(OriginalText){
		var regExp = new RegExp(FindText, "g");
		return OriginalText.replace(regExp, RepText);
	}else{
		return "";
	}
}

// @function     JsonSort 对json排序
// @param        json     用来排序的json
// @param        key      排序的键值
//升序
function JsonSortUp(json,key){
	//console.log(json);
	for(var j=1,jl=json.length;j < jl;j++){
		var temp = json[j],
			val  = temp[key],
			i    = j-1;
		while(i >=0 && json[i][key]>val){
			json[i+1] = json[i];
			i = i-1;    
		}
		json[i+1] = temp;
		
	}
	return json;
}
//降序
function JsonSortDown(json,key){
	//console.log(json);
	for(var j=1,jl=json.length;j < jl;j++){
		var temp = json[j],
			val  = temp[key],
			i    = j-1;
		while(i >=0 && json[i][key]<val){
			json[i+1] = json[i];
			i = i-1;    
		}
		json[i+1] = temp;
		
	}
	return json;
}


// 靓号判断
function Unicomm_lh_type(){
	var t = "";
	var n = String(Number(arguments[0])).split("").reverse();
	if(n.length < 2){
		return t;
	}
	if(n[0] == n[1]){
		t = "AA";
		if(n[1] == n[2]){
			t = "AAA";
			if(n[2] == n[3]){
				t = "AAAA";
			}
		}else{
			if(n[2] && n[2] == n[3]){
				t = "AABB";
			}
		}
	}else{
		if((String(n[0]) + String(n[1])) == (String(n[2]) + String(n[3]))){
			t = "ABAB";
		}else if(n[1] == n[2] && n[2] == n[3]){
			t = "AAAB";
		}else{
			if(n[1] == Number(n[0])+1 &&  n[2] == Number(n[1])+1){
				t = "ABC"
				if(n[3] == Number(n[2])+1){
					t = "ABCD"
				}
			}else if(n[1] == n[0]-1 &&  n[2] == n[1]-1){
				t = "ABC";
				if(n[3] == n[2]-1){
					t = "ABCD";
				}
			}
		}
	}
	return t;
}


function guid() {
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
//清除html标签相关
function clearHTML(str) {
	str = str.replace(/<\/?[^>]*>/g,'');
	str = str.replace(/\s/g, "");
	str = str.replace(/&nbsp;/ig,'');
	return str;
}

//日期(eg:今天明天后天...)
function GetDateStr(AddDayCount) { 
	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;
	var d = dd.getDate();
	m = (m >= 1 && m <= 9) ? "0"+m : m;
	d = (d >= 1 && d <= 9) ? "0"+d : d;
	return y+"-"+m+"-"+d; 
}


function isList(val) {
	return (val != null && typeof val != 'function' && typeof val.length == 'number')
}

function isFunction(val) {
	return val && {}.toString.call(val) === '[object Function]'
}

function isObject(val) {
	return val && {}.toString.call(val) === '[object Object]'
}


// 取得一个区间的随机整数
function rnd(n, m){
	return Math.floor(Math.random()*(m-n+1)+n)
}

// 对比身份证的到期时间 是否过期
function endDateDiff(){
	return Number(arguments[0].replace(/[^\d]/g, "") ) > Number(GetDateStr(0).replace(/[^\d]/g, "") );
}
// 是否小于多少周岁
function yearsCompareAge(){
	return Number(arguments[0].replace(/[^\d]/g, "") ) < (Number(GetDateStr(0).replace(/[^\d]/g, "") ) - (arguments[1] ? arguments[1] : 16)*10000);
}


function str2json(){
	if(arguments[0] && typeof(arguments[0]) == "string" && arguments[0].indexOf("}") !== -1 && arguments[0].indexOf("{") !== -1){
		return JSON.parse(arguments[0]);
	}else if(arguments[0] && typeof(arguments[0]) == "object"){
		return arguments[0];
	}else{
		return {};
	}
}