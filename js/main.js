behavior = {}
behavior.draw = true
behavior.type = "circle"


 

$(document).ready(function(){

    snap = Snap("#svg");
    
    

    
    $( "#svg" ).click(function(event){    
       behavior.draw = false     
        
    })
    
    
    
    $("#svg").mousemove(function(event){
        if ((event.which == 1)&&(behavior.draw == true)) {
            draw_end(active_figure)
            get_xy()
        } 
    })
    

    
        
    $("#svg").mousedown(function( event ){
        if (behavior.draw == true){
            if (behavior.type == 'line'){active_figure = draw_line()}
            if (behavior.type == 'circle'){active_figure = draw_circle()} 
        }
         
        
    }) 
        
   
    

    
    $( "#svg" ).dblclick(function(){
        
        draw_frame(active_figure)
    })


    
})



function get_xy(){
    var x_el = parseInt(  $( "#svg" ).offset().left )
    var y_el = parseInt(  $( "#svg" ).offset().top )
    var x = event.pageX - x_el
    var y = event.pageY - y_el
    return {x: x, y: y}
}

function draw_end (element){ 
        
        if (element.type == "line"){
            element.attr({
                x2: get_xy().x,
                y2: get_xy().y
           })      
        }
        if (element.type == "circle"){
          var cx = parseInt(active_figure.attr("cx")) 
          var cy = parseInt(active_figure.attr("cy")) 
          var x = get_xy().x
          var y = get_xy().y
          if (cx>x){var rx = cx - x}else{var rx = x - cx }
          if (cy>y){var ry = cy - y}else{var ry = y - cy }
          var r = Math.sqrt(Math.pow(rx,2)+Math.pow(ry,2))
          element.attr({
              r:r
          })
        }
        

       dw_frame.draw(element); 
}

function draw_line(){
    var line = snap.line(get_xy().x, get_xy().y, get_xy().x, get_xy().y);   
    line.attr({
        stroke: "#000",
        strokeWidth: '2',      
    })     
    return line;
}

function draw_circle(){
    var circle = snap.circle(get_xy().x, get_xy().y,4); 
    circle.attr({
        fill:"#FFF",
        stroke:"#000",
        strokeWidth: '2'
    })
    return circle;
}

/*


    
    $( "#svg" ).click(function(event){    
             
    })
    
    
    
    $("#svg").mousemove(function(event){
        if (event.which == 1) {
            draw_end(active_figure)
        }else{
            remove_frame(active_figure)
        }    
    })
    

        
    $("#svg").mousedown(function( event ){
        
        active_figure = draw_line();  
        
    }) 
        
   
    

    
    $( "#svg" ).dblclick(function(){
        
        draw_frame(active_figure)
    })
    
  */ 


    //drw_box.remove()
    //line.transform("r90 200 150")
    //line.data('name',"first_line")