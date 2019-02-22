function get(url,data,success){
  url = url +'?group=cn&key=2a4cc99ce34148709a2336eea61d824e'
  wx.request({
    url: url,
    success:function(res){
      success(res)
    }
  })
}