$(document).ready(function(){
  $("#monthFind").change(function(){
    var value = $(this).val();
    var reqestDate = {"month" : value};
    $.post("/costs", reqestDate, function(date){
      if(date){
        $(".alert").slideUp(function(){
          $(this).remove(); 
        });
        var html = "";
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
  
});