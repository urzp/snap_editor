dw_frame ={
    nodes:{},
    attr_nodes:{     
        fill:"#FFF",
        stroke:"#30839b",
        strokeWidth: '2',
        class:"frame_node"
    },
    edges:{},
    attr_edges:{
       stroke: "#30839b",
       strokeWidth: '1', 
       class:"frame_node",
       'stroke-dasharray': '5,5' 
    },
    inited: false,
    current_el: null,
    box: {}
}

dw_frame.init = function(){
    this.edges.top = snap.line();
    this.edges.right = snap.line();
    this.edges.bottom = snap.line();
    this.edges.left = snap.line();
    $.each(this.edges,function(index,val){
        val.attr(dw_frame.attr_edges) 
    })
    
    this.nodes.left_top = snap.circle();
    this.nodes.right_top = snap.circle();
    this.nodes.right_bottom = snap.circle();
    this.nodes.left_bottom = snap.circle();
    this.nodes.rotate = snap.circle();

    $.each(this.nodes,function(index,val){
        val.attr(dw_frame.attr_nodes)
        val.attr({id: "node_"+index})
        val.drag(dw_frame.moveFunc, dw_frame.beforeMove )
    })
    
    
    this.inited = true;
}

dw_frame.draw =  function(element){
    this.current_el = element
    //console.log(this.current_el) 
    if (dw_frame.inited == false){dw_frame.init()}
    this.get_frame(element)
    var box = this.get_frame(element)
    var box1 =  element.getBBox()


    this.nodes.left_top.attr({cx:box.x1,cy:box.y1, r:4 })   
    this.nodes.right_top.attr({cx:box.x2,cy:box.y2, r:4 })
    this.nodes.right_bottom.attr({cx:box.x3,cy:box.y3, r:4 })
    this.nodes.left_bottom.attr({cx:box.x4,cy:box.y4, r:4 }) 
    this.nodes.rotate.attr({cx:box.x5,cy:box.y5, r:6}) 

    
    this.edges.top.attr({ x1:box.x1, y1:box.y1, x2:box.x2, y2:box.y2})
    this.edges.right.attr({ x1:box.x2, y1:box.y2, x2:box.x3, y2:box.y3 })
    this.edges.bottom.attr({ x1:box.x3, y1:box.y3, x2:box.x4, y2:box.y4 })
    this.edges.left.attr({ x1:box.x4, y1:box.y4, x2:box.x1, y2:box.y1 })
    
      
    this.move_forvard()   
}

dw_frame.get_frame = function(element){
    var box ={} 
    var point = {}
    var cxy = canvas.get_center(element)
    var angle = element.attr("angle")
    var angle_r = angle*Math.PI/180


    if (element.type == "line"){
        
        var box1 =  element.getBBox()
        var x1 = parseInt(element.attr("x1")) 
        var y1 = parseInt(element.attr("y1")) 
        var x2 = parseInt(element.attr("x2")) 
        var y2 = parseInt(element.attr("y2")) 

        var matrix = element.matrix
        var h = y2 - y1 

        box.x1 = matrix.e + x1*matrix.a - y1*matrix.b
        box.y1 = matrix.f + y1*matrix.a + x1*matrix.b

        box.x3 = matrix.e + x2*matrix.a - y2*matrix.b
        box.y3 = matrix.f + y2*matrix.a + x2*matrix.b

        box.x2 = box.x3 + h*matrix.b
        box.y2 = box.y3 - h*matrix.a

        box.x4 = box.x1 - h*matrix.b
        box.y4 = box.y1 + h*matrix.a

        box.x5 = cxy.x
        box.y5 = cxy.y 

    }
    if (element.type == "rect"){
        var box1 =  element.getBBox()
        var x = parseInt(element.attr("x")) 
        var y = parseInt(element.attr("y")) 
        var w = parseInt(element.attr("width")) 
        var h = parseInt(element.attr("height")) 

        box.x1 = x
        box.y1 = y

        box.x2 = x + w
        box.y2 = y 

        box.x3 = x + w
        box.y3 = y + h

        box.x4 = x
        box.y4 = y + h       

        box.x5 = cxy.x
        box.y5 = cxy.y 

    }
    this.box = box
    return box
}

dw_frame.rotate_pont = function(centr, point, angle){
    var angle_r = angle*Math.PI/180
    var cx, cy, x, y, r, rel_centr
    cx = centr.x
    cy = centr.y
    x = point.x
    y = point.y
    r = Math.round(Math.sqrt( (cx-x)**2 + (cy-y)**2 ))
    if ( (cx - x ) >= 0 ) { rel_centr = 1 } else { rel_centr = -1 }
    var new_point = {  
        x: cx + rel_centr * parseInt(Math.cos( Math.PI - Math.asin ((y-cy)/r) + rel_centr * angle_r ) * r),
        y: cy + parseInt(Math.sin( Math.PI - Math.asin ((y-cy)/r) + rel_centr * angle_r ) * r)
    }
    return new_point
}



dw_frame.move_forvard = function(){
    var last_el = canvas.last_element()
    $.each(this.nodes,function(index,val){
        last_el.after(val)
    })
    $.each(this.edges,function(index,val){
        last_el.after(val)
    })
}

dw_frame.beforeMove = function(){
    origTransform = dw_frame.current_el.transform().local
}

dw_frame.moveFunc = function (dx, dy, posx, posy) {
    posx = posx - parseInt(  $( "#svg" ).offset().left )
    posy = posy - parseInt(  $( "#svg" ).offset().top )
    this.attr( { cx: posx , cy: posy } ); 
    dw_frame.trasform_el(this)
};

dw_frame.remove = function(){
    this.current_el = null;
    $.each(this.edges,function(index,val){
        val.remove()
    })
    $.each(this.nodes,function(index,val){
        val.remove()
    })
    this.inited = false;
}

dw_frame.trasform_el = function(move_node){

    var element = this.current_el



    var left_top = { x: parseInt(this.nodes.left_top.attr("cx")),
                     y: parseInt(this.nodes.left_top.attr("cy")) }
    var right_top = { x: parseInt(this.nodes.right_top.attr("cx")),
                      y: parseInt(this.nodes.right_top.attr("cy")) } 
    var right_bottom = { x: parseInt(this.nodes.right_bottom.attr("cx")),
                         y: parseInt(this.nodes.right_bottom.attr("cy")) }
    var left_bottom = { x: parseInt(this.nodes.left_bottom.attr("cx")),
                      y: parseInt(this.nodes.left_bottom.attr("cy")) } 
    var rotate = { x: parseInt(this.nodes.rotate.attr("cx")),
                      y: parseInt(this.nodes.rotate.attr("cy")) }     


    if (element.type == "line"){
        var matrix = element.matrix
        var new_point
        var cxy = canvas.get_center(element)
        var x1 = parseInt(element.attr("x1")) 
        var y1 = parseInt(element.attr("y1")) 
        var x2 = parseInt(element.attr("x2")) 
        var y2 = parseInt(element.attr("y2")) 

        switch( move_node.attr("id") ){
            case  "node_left_top":
                new_point = canvas.canculate_rel_point(left_top, element)
                 element.attr({
                    x1: new_point.x,  
                    y1: new_point.y 
                })
                break
            case "node_right_bottom":
                new_point = canvas.canculate_rel_point(right_bottom, element)
                element.attr({
                    x2: new_point.x,
                    y2: new_point.y 
                })
                break
            case "node_left_bottom":
                new_point = canvas.canculate_rel_point(left_bottom, element)
                element.attr({
                    x1: new_point.x,
                    y1: new_point.y
                })
                break
            case "node_right_top":
                new_point = canvas.canculate_rel_point(right_top, element)
                element.attr({
                    x2: new_point.x,
                    y2: new_point.y
                })
                break 
            case "node_rotate":
                canvas.rotate(element, rotate.x)
            break    
        }        
   }
   if (element.type == "rect"){
        switch( move_node.attr("id") ){
            case  "node_left_top":
                var width = right_top.x - left_top.x
                var height = right_bottom.y - left_top.y
                if ((width>0)&(height>0)){
                element.attr({
                    width: width,
                    height: height,
                    x: left_top.x,
                    y: left_top.y
                })
                }
                break
            case "node_right_bottom":
                var width = right_bottom.x - left_bottom.x
                var height = right_bottom.y - right_top.y
                if ((width>0)&(height>0)){
                element.attr({
                    width: width,
                    height: height,
                })
                }
                break
            case "node_left_bottom":
                var width = right_bottom.x - left_bottom.x
                var height = left_bottom.y - left_top.y
                if ((width>0)&(height>0)){
                element.attr({
                    width: width,
                    height: height,
                    x: left_bottom.x,
                    y: left_top.y
                })
                }
                break
            case "node_right_top":
                var width = right_top.x - left_top.x
                var height = right_bottom.y - right_top.y
                if ((width>0)&(height>0)){
                element.attr({
                    width: width,
                    height: height,
                    y: right_top.y
                })
                }
                break
            case "node_rotate":
                canvas.rotate(element, rotate.x)
                break    

        }  
   }
    if (element.type == "circle"){
        switch( move_node.attr("id") ){
            case  "node_left_top":
                var r =Math.abs( element.attr("cx") - move_node.attr("cx") )
                //var ry =Math.abs( element.attr("cy") - move_node.attr("cy") )
                //if (rx>ry){var r = rx}else{var r = ry }
                element.attr({
                    r: r
                })
            break
        }
       
    }
  
    dw_frame.draw(element)
}


