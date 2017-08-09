
canvas = {
    elements:[],
    current_el:{},
    count:0

}

canvas.init = function(){
    snap = Snap("#svg");
    this.events()
}

canvas.last_element = function(){
    var count_el = parseInt( snap.node.childElementCount )
    for(var i = count_el -1; i>1; i--){
        var last_el = snap.node.children[i]
        
        if (last_el.attributes.class.value == "figure"){
          var last_el_id = last_el.attributes.id.value  
          var index = parseInt( last_el_id ) -1
          i = 0
          return this.elements[index]
        }
    }  
    
}

function get_xy(){
    var x_el = parseInt(  $( "#svg" ).offset().left )
    var y_el = parseInt(  $( "#svg" ).offset().top )
    var x = event.pageX - x_el
    var y = event.pageY - y_el
    return {x: x, y: y}
}

canvas.draw = function(type){
    var element = null
    this.count++
    if (type == 'line'){
       element = snap.line(get_xy().x, get_xy().y, get_xy().x, get_xy().y);   
        element.attr({
            stroke: "#000",
            strokeWidth: '2' 
        })

    }
    if (type == 'circle'){
       element = snap.circle(get_xy().x, get_xy().y,4); 
        element.attr({
            fill:"#FFF",
            stroke:"#000",
            strokeWidth: '2' 
        })      
    }    
    
    element.attr({id: this.count, class: "figure"})
    this.elements.push(element)
    this.current_el = element
    return element;  
}

canvas.draw_end = function(shift){ 
        var element = this.current_el
        if (element.type == "line"){
            var xy = get_xy()
            var x =xy.x
            var y =xy.y
            var x1 = parseInt( element.attr("x1") )
            var y1 = parseInt( element.attr("y1") )
            if (shift){
                if (Math.abs(x - x1) > Math.abs(y - y1)){
                   y = y1
                }else{
                    x = x1
                }
            }
            element.attr({
                x2: x,
                y2: y
            }) 
            
     
        }
        if (element.type == "circle"){
          var cx = parseInt(this.current_el.attr("cx")) 
          var cy = parseInt(this.current_el.attr("cy")) 
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
       get_xy(); 
}

canvas.drag_el = function(dx, dy, posx, posy){
    if(canvas.current_el != null){
        var posx = posx - parseInt(  $( "#svg" ).offset().left )
        var posy = posy - parseInt(  $( "#svg" ).offset().top )
        canvas.get_center(canvas.current_el)
        if (canvas.current_el.type == "line"){ 
            var x1 = parseInt( canvas.current_el.attr('x1') )
            var x2 = parseInt( canvas.current_el.attr('x2') )
            var y1 = parseInt( canvas.current_el.attr('y1') )
            var y2 = parseInt( canvas.current_el.attr('y2') )
            var cx = parseInt( (x2 - x1)/2  )
            var cy = parseInt( (y2 - y1)/2  )
            x1 = x1+(posx - x1 - cx) - canvas.catch_el_pos.x
            y1 = y1+(posy - y1 - cy) - canvas.catch_el_pos.y
            x2 = x2+(posx - x2 + cx)  - canvas.catch_el_pos.x
            y2 = y2+(posy  - y2 + cy) - canvas.catch_el_pos.y 
            canvas.current_el.attr({ x1: x1, x2: x2, y1:y1, y2:y2 }) 
        }
        if (canvas.current_el.type == "circle"){ 
            var rel_cur_x = posx - canvas.catch_el_pos.x
            var rel_cur_y = posy - canvas.catch_el_pos.y
            canvas.current_el.attr({ cx: rel_cur_x, cy:rel_cur_y }) 
        }
        dw_frame.draw(canvas.current_el); 
    }
}

canvas.move = function(derection){
    if(this.current_el != null){
       this.catch_el_pos = {x:0, y:0} 
       canvas.get_center(canvas.current_el)
       var cx = this.current_el_center.x +  parseInt(  $( "#svg" ).offset().left )
       var cy = this.current_el_center.y +  parseInt(  $( "#svg" ).offset().top )
       if(derection == LEFT) { cx--}
       if(derection == RIGHT){ cx++}
       if(derection == UP)   { cy--}
       if(derection == DOWN) { cy++}
       canvas.drag_el(null, null, cx, cy)

    }
}

canvas.get_grap_pos = function(){
    if (canvas.current_el){
        var cursor = get_xy()
        this.get_center(canvas.current_el)
        var rel_cur_x = cursor.x - canvas.current_el_center.x 
        var rel_cur_y = cursor.y - canvas.current_el_center.y
        this.catch_el_pos = {x:rel_cur_x, y:rel_cur_y }
        return this.catch_el_pos
    }
}

canvas.get_center = function(element){
    if(element){
        if (element.type == "line"){
            var x1 = parseInt( element.attr('x1') )
            var x2 = parseInt( element.attr('x2') )
            var y1 = parseInt( element.attr('y1') )
            var y2 = parseInt( element.attr('y2') )
            var cx = parseInt( (x2 - x1)/2 + x1 )
            var cy = parseInt( (y2 - y1)/2 + y1)
            this.current_el_center = {x:cx, y:cy }
            return this.current_el_center
        }
        if (canvas.current_el.type == "circle"){
            var cx = parseInt( canvas.current_el.attr("cx") )
            var cy = parseInt( canvas.current_el.attr("cy") )
            this.current_el_center = {x:cx, y:cy }
            return this.current_el_center
        }  
    }
}

canvas.select = function(id){
    var found = this.elements.find(function(element){
        if (element.attr("id") == id){return element}
    })
    if (found != null) {
        this.current_el = found
        found.before(this.last_element()) 
        dw_frame.draw(found);
        return found     
    }else{
        return null
    }

}

canvas.unselect = function(){
   this.current_el = null
   dw_frame.remove() 
}
