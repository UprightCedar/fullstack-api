
var index = require("./index")
var user = require("./users");
var menu = require("./menu");
var production = require("./production");
var member = require("./member");
var article = require("./article");

var app = null;

exports.startUrls = function(app) {
	this.app=app;
	app.get(["/","/web/index"], index.index);
	app.get("/web/production", menu.production);
	app.get("/web/member", menu.member);
	app.get("/web/search", menu.search);
	app.get("/web/blog", menu.blog);
	app.get("/web/contact", menu.contact);
	app.get("/api/index", index.main);
	app.use("/api/v1/login", index.login);
	app.use("/api/v1/user/addUser", user.addUser);
	app.use("/api/v1/user/getUserInfoList", user.getUserInfoList);
	app.use("/api/v1/menu/getMenuList", menu.getMenuList);
	app.use("/api/v1/production/getProductionList", production.getProductionList);
	app.use("/api/v1/member/getMemberList", member.getMemberList);
	app.use("/api/v1/article/getArticleList", article.getArticleList);
};