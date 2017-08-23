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
    var box = element.getBBox();
    this.box = box;
    this.nodes.left_top.attr({cx:box.x,cy:box.y, r:4 })   
    this.nodes.right_top.attr({cx:box.x+box.w,cy:box.y, r:4 })
    this.nodes.right_bottom.attr({cx:box.x+box.w,cy:box.y+box.h, r:4 })
    this.nodes.left_bottom.attr({cx:box.x,cy:box.y+box.h, r:4 }) 
    this.nodes.rotate.attr({cx:box.x+box.w/2,cy:box.y - 30, r:4 }) 
    
    this.edges.top.attr({ x1:box.x, y1:box.y, x2:box.x+box.w, y2:box.y})
    this.edges.right.attr({ x1:box.x+box.w, y1:box.y, x2:box.x+box.w, y2:box.y+box.h })
    this.edges.bottom.attr({ x1:box.x+box.w, y1:box.y+box.h, x2:box.x, y2:box.y+box.h })
    this.edges.left.attr({ x1:box.x, y1:box.y+box.h, x2:box.x, y2:box.y })
    this.edges.rotate.attr({ x1:box.x+box.w/2, y1:box.y, x2:box.x+box.w/2, y2:box.y - 30 })
      
    this.move_forvard()   
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


