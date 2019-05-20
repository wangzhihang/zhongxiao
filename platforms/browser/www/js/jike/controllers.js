var controllersfile = [
	

	  "cbss/group/queryGroupList"
	, "cbss/group/queryGroupListByCode"	// 对公信息
	, "cbss/number-package-cbss"
	, "cbss/write-sim"


	, "bss/school/querySchoolList"
	, "bss/writesim"

	//, "bss/dealerreturn2activity"	// bss返单+定制活动(公安定制版)
	//, "bss/bssActivity"				// bss定制活动
	, "bss/lan-bss"					// 固带移卡
];

for(var i in controllersfile)
{
	document.write('<script type="text/javascript" src="js/jike/controllers/' + controllersfile[i] + '.js"></script>');
}