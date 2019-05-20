var controllersfile = [

	"number/list",
	"number/filter",
	"cbss/fixed",		// cbss 无线固话

];

for(var i in controllersfile)
{
	document.write('<script type="text/javascript" src="js/unicomm/controllers/' + controllersfile[i] + '.js"></script>');
}
