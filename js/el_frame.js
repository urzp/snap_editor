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
    this.edges.rotate = snap.line();
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
        val.drag(dw_frame.moveFunc)
    })
    
    
    this.inited = true;
}

dw_frame.draw =  function(element){
    this.current_el = element
    //console.log(this.current_el) 
    if (dw_frame.inited == false){dw_frame.init()}
    this.get_frame(element)
    var box = this.get_frame(element)
    this.nodes.left_top.attr({cx:box.x1,cy:box.y1, r:4 })   
    this.nodes.right_top.attr({cx:box.x2,cy:box.y2, r:4 })
    this.nodes.right_bottom.attr({cx:box.x3,cy:box.y3, r:4 })
    this.nodes.left_bottom.attr({cx:box.x4,cy:box.y4, r:4 }) 
    this.nodes.rotate.attr({cx:box.x5,cy:box.y5, r:4 }) 
    
    this.edges.top.attr({ x1:box.x1, y1:box.y1, x2:box.x2, y2:box.y2})
    this.edges.right.attr({ x1:box.x2, y1:box.y2, x2:box.x3, y2:box.y3 })
    this.edges.bottom.attr({ x1:box.x3, y1:box.y3, x2:box.x4, y2:box.y4 })
    this.edges.left.attr({ x1:box.x4, y1:box.y4, x2:box.x1, y2:box.y1 })
    
      
    this.move_forvard()   
}

dw_frame.get_frame = function(element){
    var box ={} 
    var cxy = canvas.get_center(element)
    var cx = cxy.x
    var cy = cxy.y
    var angle = element.attr("angle")
    var angle_r = angle*Math.PI/180

    if (element.type == "line"){
        var x, y, r
        x = parseInt(element.attr("x1"))
        y = parseInt(element.attr("y1"))
        r = Math.round(Math.sqrt( (cx-x)**2 + (cy-y)**2 ))
        box.x1 = cx + parseInt(Math.cos( Math.PI - Math.asin ((y-cy)/r) + angle_r ) * r)
        box.y1 = cy + parseInt(Math.sin( Math.PI - Math.asin ((y-cy)/r) + angle_r ) * r)

        x = parseInt(element.attr("x2"))
        y = parseInt(element.attr("y1"))
        r = Math.round(Math.sqrt( (cx-x)**2 + (cy-y)**2 ))
        box.x2 = cx - parseInt(Math.cos( Math.PI - Math.asin ((y-cy)/r) - angle_r ) * r)
        box.y2 = cy + parseInt(Math.sin( Math.PI - Math.asin ((y-cy)/r) - angle_r ) * r)

        x = parseInt(element.attr("x2"))
        y = parseInt(element.attr("y2"))
        r = Math.round(Math.sqrt( (cx-x)**2 + (cy-y)**2 ))
        box.x3 = cx - parseInt(Math.cos( Math.PI - Math.asin ((y-cy)/r) - angle_r ) * r)
        box.y3 = cy + parseInt(Math.sin( Math.PI - Math.asin ((y-cy)/r) - angle_r ) * r)

        x = parseInt(element.attr("x1"))
        y = parseInt(element.attr("y2"))
        r = Math.round(Math.sqrt( (cx-x)**2 + (cy-y)**2 ))
        box.x4 = cx + parseInt(Math.cos( Math.PI - Math.asin ((y-cy)/r) + angle_r ) * r)
        box.y4 = cy + parseInt(Math.sin( Math.PI - Math.asin ((y-cy)/r) + angle_r ) * r)


        box.x5 = cx 
        box.y5 = cy 



    }
    this.box = box
    return box
}

/*
dw_frame.rotate = function(angle, element){
    var cxy = canvas.get_center(element)
    var box = element.getBBox()
    var xy
    var angle_r = angle*Math.PI/180
    //xy = this.new_coordinats(cxy, box.x, box.y, angle)

    this.box.x = box.x
    this.box.y = box.y
    this.box.x2 = box.x + Math.cos(angle_r) * box.w
    this.box.y2 = box.y + Math.sin(angle_r) * box.w
    this.box.w = box.w
}

dw_frame.new_coordinats = function(cxy, x, y, angle){
    var cx = cxy.x
    var cy = cxy.y
    var angle_r = angle*Math.PI/180
    var r = Math.round(Math.sqrt( (cx-x)**2 + (cy-y)**2 ))
    
    var x_new = cx + Math.cos( Math.PI - Math.asin ((y-cy)/r) - angle_r ) * r
    var y_new = cy + Math.sin( Math.PI - Math.asin ((y-cy)/r) - angle_r ) * r
    console.log(Math.asin ((y-cy)/r))
    return {x: x_new, y: y_new }
}
*/

dw_frame.move_forvard = function(){
    var last_el = canvas.last_element()
    $.each(this.nodes,function(index,val){
        last_el.after(val)
    })
    $.each(this.edges,function(index,val){
        last_el.after(val)
    })
}

dw_frame.moveFunc = function (dx, dy, posx, posy) {
    posx = posx - parseInt(  $( "#svg" ).offset().left )
    posy = posy - parseInt(  $( "#svg" ).offset().top )
    this.attr( { cx: posx , cy: posy } ); 
    //console.log("test")
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
        switch( move_node.attr("id") ){
            case  "node_left_top":
                element.attr({
                    x1: left_top.x,
                    y1: left_top.y
                })
                break
            case "node_right_bottom":
                element.attr({
                    x2: right_bottom.x,
                    y2: right_bottom.y
                })
                break
            case "node_left_bottom":
                element.attr({
                    x1: left_bottom.x,
                    y1: left_bottom.y
                })
                break
            case "node_right_top":
                element.attr({
                    x2: right_top.x,
                    y2: right_top.y
                })
            case "node_rotate":
                var cxy = canvas.get_center(element)
                var ang = rotate.x - cxy.x 
                var transform = "rotate("+ang+","+cxy.x+","+cxy.y+")"
                element.attr({transform:transform})
                element.attr({angle:ang})
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
        }  
   }
    if (element.type == "circle"){
        var r =Math.abs( element.attr("cx") - move_node.attr("cx") )
        //var ry =Math.abs( element.attr("cy") - move_node.attr("cy") )
        //if (rx>ry){var r = rx}else{var r = ry }
        element.attr({
            r: r
        })
       
    }
  
    dw_frame.draw(element)
}


