var servicesfile = [

    "unicomm_server",

    "ble",
    "ble_identity",

    "telList",
    "my",
    "LoginService",
    "url2base64",

    "semiManufacturesSIM", // 半成卡转换号段规则

    "order_create",
    "identity_authentication",
    "focus"

];

for (var i in servicesfile) {
    document.write('<script type="text/javascript" src="js/service/' + servicesfile[i] + '.js"></script>');
}