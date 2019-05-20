function alertInfo() {
	var s = String(arguments[0] ? arguments[0] : "");

	if(s.indexOf("省份代理商接口返回错误信息如下") !== -1){
		return "CBSS余额不足的原因，请检查：<br>1.CBSS余额。<br>2.合同是否到期。<br>3.是否授权，请联系渠道经理协助处理。<br><span style='color:#F00'>处理后半小时内可在本APP“现场写卡”继续提交</span>"
	}
	else if (s.indexOf("尚未登录") !== -1){
		return "登录信息失效，您的CBSS需要验证码登录，请进入控制台，点击CBSS验证码登录！"
	}
	else if (s.indexOf("请和上级代理商联系") !== -1 ){
		return "您的密码可能已过期。<br />请在联通系统修改BSS或CBSS密码并重新绑定。"
	}
	else if (
			s.indexOf("给定关键字不在字典中")  !== -1
		||  s.indexOf("未将对象引用设置到对象的实例")  !== -1
	){
		return "系统错误，你的APP版本可能未更新，请更新版本、重新下载版APP或联系技术支持(029-86262222)！"
	}
	else if(
			s.indexOf("操作超时") !== -1
		||  s.indexOf("远程服务器返回错误") !== -1
		||  s.indexOf("联通服务器请求失败") !== -1
		||  s.indexOf("VPN登录失败") !== -1
		||  s.indexOf("CallWebSerivceHelper1调用服务异常，请联系管理员") !== -1
	){
		return "联通服务器请求失败，请重新提交！"
	}
	else if(
			s.indexOf("获取写卡数据异常:key:") !== -1
	){
		return "联通系统不稳定导致写卡失败，请更换白卡重新提交！"
	}
	else if(
			s.indexOf("获取卡号失败") !== -1
	){
		return "请检查网络、白卡、阅读器、插卡方式，再重新提交！"
	}
	else if(
		s.indexOf("获取tradeid出错") !== -1
	){
		return "CBSS工号权限问题，请联系渠道经理给CBSS工号赋权！"
	}
	else if(
		s.indexOf("调用资源接口更新卡状态失败") !== -1
	){
		return "需要做成卡延期，请联系渠道经理处理！"
	}
	else if(
			s.indexOf("36890;知总部写卡结果") !== -1
	){
		return "卡资源同步失败。<br>处理方法：<br>1.换卡继续提交。<br>2.此卡片可废卡重置。"
	}
	else if(
			String(s) === "-1"
	){
		return "网络请求超时，请确认自己的网络状态后，重新提交！"
	}
	else if(
			s.indexOf("提交产品新装:接口返回异常:") !== -1
	){
		return "联通接口返回异常，<span style='color:#F00'>有可能会造成 VAC 卡单</span><br>建议您返回首页重新办理！"
	}	
	else if(
		s.indexOf("此号码不存在主卡标识") !== -1
	){
		return "此号码不存在主卡标识，请在CBSS系统给主卡添加主副卡包后，再进行副卡操作！"
	}
		
	else if(
		s.indexOf("基础连接已经关闭") !== -1
	){
		return "联通系统正在发布版本，请稍后再试！"
	}
	else if(
		s.indexOf("$$30001$$TF_F_PAYRELATION资料不存在或者已经失效") !== -1
	){
		return "1.请继续提交<br>2.多次提交无反应，请返回重新受理"
	}
	else if(
		s.indexOf("36890;知总部写卡结果（成功），接口同步资料失败:卡状态变更失败") !== -1
	){
		return "联通cbss报错，请继续提交<br>如果收到多次本提示，可以在电脑CBSS里“现场写卡”继续操作；或重新给用户换号换卡受理"
	}

	else if(
		s.indexOf("不允许社会渠道卡进行此业务") !== -1
	){
		return "请使用码上购专属白卡，并前去“待处理订单”里继续写卡操作"
	}

	else if(
		s.indexOf("获取写卡数据异常:null") !== -1
	){
		return "白卡数据源有问题，请联系发卡渠道，重新下发白卡"
	}

	else if(
		s.indexOf("未找到刚才提交的台帐,请重新确认") !== -1
	){
		return "您办理的业务可能已经提交成功，请前去号码状态进行查询，并联系号码之家后台修改订单状态"
	}




	// 码上购
	else if(
		s.indexOf("W011:不允许社会渠道卡进行此业务") !== -1
	){
		return "不允许使用社会渠道卡受理，请更换电渠白卡，继续提交！<br>也可在“待处理订单”里面继续受理。"
	}
	else if(
		s.indexOf("调用规则校验微服务失败：您选择的号码存在待写卡工单，请先对此号码撤单后才可以再次开户") !== -1
	){
		return "每人仅限办理一张王卡。<br>1.需要在“待处理订单”里重新提交。<br>2.若“待处理订单”里面没有订单信息，则表示此用户已在别的地方申请过王卡，不可以再办理。"
	}

	// 成卡
	else if(
		s.indexOf("鎻愪氦澶辫触! 姝よ瘉浠惰秴杩?9宀佷笅宸插瓨鍦ㄧ敤鎴峰湪鐢ㄤ骇鍝佽吘璁帇鍗★") !== -1
	){
		return "此用户证件已经申请过王卡产品，不允许再次受理"
	}

	else{
		return s;
	}
}



function alertInfoError(){
	var str = arguments[0] ? arguments[0] : "";
	var s = String(str);

	if(
			s.indexOf("操作超时") !== -1
		||  s.indexOf("远程服务器返回错误") !== -1
		||  s.indexOf("联通服务器请求失败") !== -1
		||  s.indexOf("VPN登录失败") !== -1
	){
		return true;
	}
	else{
		return false;
	}
}