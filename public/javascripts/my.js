$(document).ready(function(){
  /*监听要提交的数据表单事件*/
  $("#monthFind").change(function(){
    var value = $(this).val();
    var reqestDate = {"month" : value};
    /*post发送要查询的值给服务器端*/
    $.post("/costs", reqestDate, function(date){
      /*如果有数据，优雅的动画显示*/
      if(date){
        $(".alert").slideUp(function(){
          $(this).remove(); 
        });
        var html = "";
        /*将接收到的数据变为html*/
        for(i in date){
          if(date[i].date.month){
            var time = date[i].date.month; 
          }
          else{
            var time = date[i].date; 
          }
          html +=  "<tr><td><a href = '/costs/fllorName/" +date[i].fllorName + "'>" +date[i].fllorName +"</a></td>" + "<td>" + date[i].toalCost + "</td>" + "<td>" + time + "</td></tr>"; 
        }
        console.log(html);
        $(".table tbody tr").slideUp("fast",function(){
          $(this).remove();
          $(".table tbody").html(html).hide().show("fast");
        });
        console.log("ok");
      }
      /*没有查询到给出月份的信息，优雅的动画显示*/
      else{
        /*$(".alert").slideUp(function(){
          $(this).remove(); 
        });*/
        
        
        var html = "<div id='find' class='alert alert-danger'><p>没有查询到当前时间的费用列表</p></div>";
        if(!$("#find").hasClass('alert')){
          $(html).insertBefore($("#monthFind")).hide().slideDown();
        }
        else{
          $("#find p"). effect('shake', {distance: 20}); 
        }
        
        
        console.log("no"); 
      }
    });
  });
  $("li").removeClass("active");
  switch(location.pathname){
    case "/" : $(".link1").addClass("active"); break;
    case "/failures" : $(".link5").addClass("active");break;
  }
  
});