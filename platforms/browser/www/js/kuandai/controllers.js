var controllersfile = [
	

	"wojia/address-area",
	"wojia/address-detailed",
	"wojia/submit-select-terminals",
	"wojia/submit-order-confirm",
	// "wojia/submit",
	"wojia/submit-wojia",

	"wojia/combination/package-tel",
	"wojia/combination/package-tel-customized",
	"wojia/combination/package-lan",
	"wojia/combination/add-two",
	"wojia/ronghe/package-lan",
	//,"wojia/ronghe/package-lan-",
	"wojia/iptvinfo",
	"wojia/lan/package-lan",
	"wojia/submit-singleLan",

	"wojia/number-selected",
	"wojia/number-into",
	"wojia/number-read-write",

	// "bssLan/bss_lan",
	// ,"wojia/single-submit-order-confirm"
	// ,"wojia/combination-submit-order-confirm"
	// ,"wojia/handle-kuandai"
];

for(var i in controllersfile)
{
	document.write('<script type="text/javascript" src="js/kuandai/controllers/' + controllersfile[i] + '.js"></script>');
}