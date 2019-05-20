var controllersfile = [
	"shopIndex",
	"shopList",
	"shop",
	"shopSet",
	"addShop",
	"shopLoginLog",
	"shopLoginState",
	"addSalesman",
	"salesmanIndex",
	"salesman",
	"addressBookList",
	"addressBookDetail",
	"avatarCheck",
	"dianpuPowerDivsion",

	// "lock",
	"signIn",
	"signUp",
	
	"changePassword",
	"userAccount",
	"commissionLog",
	"commissionSet",,
	
	"kkOrderList",
	"kkOrderDetail",
	
	"hfOrderList",
	
	"kdOrderList",
	"kdOrderDetail",
	
	"bindBankCard",
	"shopRechargeLog",
	"transactionLog",
	
	"withdrawsCash",
	// 码上购
	"mSgAccountList",
	"mSgForm",
	"mSgDevelopersList",
	//cbss
	"cbssAccountList",
	"changeCbssPwd",
	"cbssShopList",
	"addCbssAccount",
	"cbssDevelopersList",
	//bss
	"bssAccountList",
	"changeBssPwd",
	"bssShopList",
	"addBssAccount",
	"bssDevelopersList",
	"dianpuManageList",
	"salesmanManageList",
	"jobnumConfigList",
	"about-account-flow",
	"fix-phone-daili",
	"fix-phone-daili-detail",
	"userInfo",
	"userSet",
	"signupChannel",
	"shopInspection",
	"shopInspectionInfo",
	"shopInspectionList",
	"addShopInspectionRecord",
	"salesmanExistingCard",
	"salesmanSendCard",
	"organizationManage",
	"orgNumberOrderList",
	"orgLanOrderList",
	"orgAddSalesman",
	"orgAddShop",
	"org-index-list",
	"org-saleman-shop-list",
	"org-saleman-shop-info",
	"org-shop-order-info",
	"addshop-upload-pic",
	"bond-bank-card",
	"virtual-account",
	"virtual-recharge",

	"cbssSmsCode/login"

	// "financialStatistics",   //财务统计
	// "productStatistics",     //产品统计
	// "salemanStatistics",     //业务员统计
	// "shopStatistics"         //店面统计
	
	// "saleman-send-commission",
	// "dianpu-send-commission",
	// "obtain-commission-record"   //佣金

];

for(var i in controllersfile)
{
	document.write('<script src="js/daili/controllers/' + controllersfile[i] + '.js"></script>');
}