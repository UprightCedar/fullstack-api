// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../libs/db/mysql');
var articleSQL = require('../libs/db/articlesql');
var pool = mysql.createPool(dbConfig.mysql );
var commons = require("../libs/core/common");
var formidable = require("formidable");  
var form = new formidable.IncomingForm();

// 添加文章
exports.addArticle = function(req, res, next){
  var method = req.method;
  if(method === "GET"){
    commons.resFail(res, 101, "get请求方式无法接收，请用post提交！");
    return;
  }

  if(!req.session.sess_admin) 
    commons.resFail(res, 1, "需要登录才可以访问");
  else {
    pool.getConnection(function(err, connection) {  
      var param = req.query || req.params;   
      var date = new Date();
      if(connection){
        connection.query(articleSQL.insert, [param.aid,param.title,param.date,date,param.author,param.type,param.excerpt,content,param.url,param.headerImage,param.resources,param.remark], function(err, result) {
          if(result) {      
            commons.resSuccess(res, "插入成功"); 
          }else{
            commons.resFail(res,1,"插入失败："+err);
          }
          connection.release();  
        });
      }
      if(err){
        commons.resFail(res,1,"服务器连接失败："+err);
      }
    });
  }
};

// 获取文章
exports.getArticle = function(req, res, next){
  pool.getConnection(function(err, connection) {
    var param = req.query || req.params;
    if(connection){
      connection.query(articleSQL.getArticleById, [param.aid], function(err, result) {
        if(result) {      
          commons.resSuccess(res, "操作成功",result); 
        }else{
          commons.resFail(res,1,"操作失败");
        }
        connection.release();  
      });
    }
    if(err){
      commons.resFail(res,1,"服务器连接失败："+err);
    }
  });
};

 // 获取文章列表
 exports.getArticleList = function(req, res, next){
  pool.getConnection(function(err, connection) {
    var param = req.query || req.params;
    var pageNo = param.pageNo || 1;
    var pageSize = param.pageSize || 10;
    var dataBegin = (pageNo -1 )*pageSize;
    if(connection){
      connection.query(articleSQL.getArticleList, [pageSize,dataBegin], function(err, result) {
        if(result) {      
          commons.resSuccess(res, "操作成功",result); 
        }else{
          commons.resFail(res,1,"操作失败("+err+")");
        }
        connection.release();  
      });
    }
    if(err){
     commons.resFail(res,1,"服务器连接失败："+err);
   }
 });
};

  // 上传图片
  var cacheFolder = 'public/images/uploadcache/';
  exports.uploadImage = function(req, res) {
    var currentUser = req.session.user;
    var userDirPath =cacheFolder+ currentUser.id;
    if (!fs.existsSync(userDirPath)) {
      fs.mkdirSync(userDirPath);
    }
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;
    var displayUrl;
    form.parse(req, function(err, fields, files) {
      if (err) {
        res.send(err);
        return;
      }
        var extName = ''; //后缀名
        switch (files.upload.type) {
          case 'image/pjpeg':
          extName = 'jpg';
          break;
          case 'image/jpeg':
          extName = 'jpg';
          break;
          case 'image/png':
          extName = 'png';
          break;
          case 'image/x-png':
          extName = 'png';
          break;
        }
        if (extName.length === 0) {
          res.send({
            code: 202,
            msg: '只支持png和jpg格式图片'
          });
          return;
        } else {
          var avatarName = '/' + Date.now() + '.' + extName;
          var newPath = form.uploadDir + avatarName;
          displayUrl = UPLOAD_FOLDER + currentUser.id + avatarName;
            fs.renameSync(files.upload.path, newPath); //重命名
            res.send({
              code: 200,
              msg: displayUrl
            });
          }
        });
  };
