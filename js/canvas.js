
canvas = {
    next_point: null,
    current_point_path: null,
    elements:[],
    selected_el:[],
    current_el:{},
    count:0,
    stop_move: false 
};

canvas.init = function(){
    snap = Snap("#svg");
    this.pointer = {
        selecting: false
    }
    this.events();
};


canvas.dragable = function(element){
    
    

        dragMove = function(dx, dy, ev, x, y) {
            //console.log(canvas.stop_move)
            if (canvas.stop_move == false ){
                var transform = origTransform + (origTransform ? "T" : "t") + [dx, dy];
                element.attr({ transform: transform });
                dw_frame.draw(canvas.current_el);  
            }   
        }

        beforeMove = function(){
            //console.log("before move")
            origTransform = element.transform().local;
        };

        element.drag(dragMove, beforeMove);

};

canvas.draw = function(type){
    canvas.stop_move = true
    canvas.unselect()
    var element = null;
    this.count++;
    var cursor = get_xy();
    if (type == 'pointer'){
       element = snap.rect(cursor.x, cursor.y, 10, 10); 
       element.attr({
        type: "pointer",
        opacity: 0.5,
        fill:"#5FC0CE",
        stroke:"#015965",
        strokeWidth: '2'});  
        this.pointer.frame = element;  
   }; 
    if (type == 'line'){
       element = snap.line(cursor.x, cursor.y, cursor.x, cursor.y);   
       element.attr({
        type: "line",
        stroke: "#000",
        strokeWidth: '2'});
   };
   if (type == 'path'){
        this.next_point = 1;
        this.current_point_path = 1;
        var beg_xy = {x:cursor.x, y:cursor.y}
        element = snap.path("M"+beg_xy.x + " " + beg_xy.y);
        element.attr({
        type: "path",
        fill:"none",
        stroke:"#000",
        strokeWidth: '2'});  

   };
   if (type == 'polygon'){
        this.next_point = 1;
        this.current_point_path = 1;
        var beg_xy = {x:cursor.x, y:cursor.y}
        element = snap.polygon(beg_xy.x, beg_xy.y);
        element.attr({
        type: "polygon",
        fill:"none",
        stroke:"#000",
        strokeWidth: '2'});  

   };
   if (type == 'rectangle'){
       element = snap.rect(cursor.x, cursor.y, 10, 10); 
       element.attr({
        type: "rect",
        fill:"none",
        stroke:"#000",
        strokeWidth: '2'});    
   }; 
   if (type == 'circle'){
       element = snap.circle(cursor.x, cursor.y,4); 
       element.attr({
        type: "circle",
        fill:"none",
        stroke:"#000",
        strokeWidth: '2'});      
   }; 
   if (type == 'ellipse'){
       element = snap.ellipse(cursor.x, cursor.y,4,4); 
       element.attr({
        type: "ellipse",
        fill:"none",
        stroke:"#000",
        strokeWidth: '2'});      
   }; 
   if (type == 'arc'){
        var beg_xy = {x:cursor.x, y:cursor.y}
        var end_xy = {x:cursor.x + 50, y:cursor.y }
        var r_xy = {x:1, y:1}
        var x_rotation = 0
        var large_arc = 1
        var sweep = 1 
        var d = this.arc_set_params(beg_xy, r_xy, x_rotation, large_arc, sweep, end_xy)
        element = snap.path(d); 
        element.attr({
        type: "arc",
        fill:"none",
        stroke:"#000",
        strokeWidth: '2' });      
   };  
   if (type == "triangle"){

        element = snap.polygon(cursor.x, cursor.y, cursor.x + 100, cursor.y, cursor.x + 50, cursor.y - 50);
        element.attr({
        type: "triangle",
        fill:"none",
        stroke:"#000",
        strokeWidth: '2'});   
   };     

   element.attr({id: this.count, class: "figure"});
   this.elements.push(element);
   this.current_el = element;
   this.dragable(element);
   return element;  
};

canvas.draw_end = function(shift){ 
    var element = this.current_el;
    var cursor  = canvas.canculate_rel_point(get_xy(), element)// get_xy();
    if (element.attr("type") == "pointer"){
        var x_start = parseInt( canvas.current_el.attr('x') );
        var y_start = parseInt( canvas.current_el.attr('y') );
        var width =  Math.abs(cursor.x - x_start);
        var height = Math.abs( cursor.y - y_start);
        if (shift){
            if (height > width) {width = height} else {height = width};
        };
        if (cursor.x < x_start) { element.attr({x:cursor.x}) };
        if (cursor.y < y_start) { element.attr({y:cursor.y}) };
        element.attr({
            width: width ,
            height: height }); 
        this.selecting()
    };
    if (element.attr("type") == "line"){
        var x =cursor.x;
        var y =cursor.y;
        var x1 = parseInt( element.attr("x1") );
        var y1 = parseInt( element.attr("y1") );
        if (shift){
            if ( Math.abs(x - x1) >  Math.abs(y - y1) ){ y = y1; };
            if ( Math.abs(x - x1) <= Math.abs(y - y1) ){ x = x1; };
        };
        element.attr({
            x2: x,
            y2: y }); 
    };
    if (element.attr("type") == "path"){
        var d = element.attr("d");
        var points = canvas.path_get_params(d)
        points[this.next_point] = cursor
        this.current_point_path = this.next_point;
        var d = canvas.path_set_params(points)
        element.attr({
            d: d
        })
    }
    if (element.attr("type") == "polygon"){
        var params = element.attr("points")
        params[this.next_point * 2] = cursor.x
        params[this.next_point * 2 + 1 ] = cursor.y
        this.current_point_path = this.next_point;
        element.attr({
            points: params
        })
    }
    if (element.attr("type") == "rect"){
        var x_start = parseInt( canvas.current_el.attr('x') );
        var y_start = parseInt( canvas.current_el.attr('y') );
        var width =  Math.abs(cursor.x - x_start);
        var height = Math.abs( cursor.y - y_start);
        if (shift){
            if (height > width) {width = height} else {height = width};
        };
        if (cursor.x < x_start) { element.attr({x:cursor.x}) };
        if (cursor.y < y_start) { element.attr({y:cursor.y}) };
        element.attr({
            width: width ,
            height: height }); 
    };
    if (element.attr("type") == "circle"){
        var cx = parseInt(this.current_el.attr("cx")); 
        var cy = parseInt(this.current_el.attr("cy")); 
        var x = get_xy().x;
        var y = get_xy().y;
        var rx = Math.abs(cx - x);
        var ry = Math.abs(cy - y);
        var r = Math.sqrt( Math.pow(rx,2) + Math.pow(ry,2) );
        element.attr({ r:r });
    };
    if (element.attr("type") == "ellipse"){
        var cx = parseInt(this.current_el.attr("cx")); 
        var cy = parseInt(this.current_el.attr("cy")); 
        var x = get_xy().x;
        var y = get_xy().y;
        var rx = Math.abs(cx - x);
        var ry = Math.abs(cy - y);
        element.attr({
            rx:rx,
            ry,ry });
    }; 
    if (element.attr("type") == "arc"){

        var d = element.attr("d"); 
        var xy = get_xy()
        var x = xy.x;
        var y = xy.y;
        var params = canvas.arc_get_params(d)
        var beg_xy = params.m_xy
        var r_xy = params.r_xy
        r_xy.x = get_distanse( xy, beg_xy)/2
        r_xy.y = r_xy.x

                
        d = canvas.arc_set_params(null, r_xy, null, null, null, {x:x, y:y}, d )
        element.attr({
            d:d });
    };
    if (element.attr("type") == "triangle"){
        var p = element.attr("points")
        var points = canvas.triangle_get_params(p)
        var xy = get_xy()
        var beg_end = get_distanse(points.p1, xy)
        var centr = get_center_line(points.p1, xy)
        var centr_el = canvas.get_center_small_circle(points.p1,points.p2,points.p3)
        var ang = get_angle_line(points.p1, xy).ang_deg
        var h = (beg_end*Math.sqrt(3))/2
        points.p3 = {x:centr.x, y:centr.y - h}
        points.p3 = get_rotate(points.p3, centr, ang)

        p = canvas.triangle_set_params(null, xy, points.p3, p)
        element.attr({
            points: p,
            centr_x: centr_el.x,
            centr_y: centr_el.y
        });
    };
    dw_frame.draw(element);
    get_xy(); 
};


canvas.drag_el = function(dx, dy){
    if(canvas.current_el != null){
        var element = canvas.current_el;
        origTransform = element.transform().local;
        var transform = origTransform + (origTransform ? "T" : "t") + [dx, dy];
        element.attr({transform:transform});
        dw_frame.draw(element);     
    };
};

canvas.move = function(derection){
    if(this.current_el != null){
       var cx = 0;
       var cy = 0;
       if(derection == LEFT) { cx--};
       if(derection == RIGHT){ cx++};
       if(derection == UP)   { cy--};
       if(derection == DOWN) { cy++};
       console.log("cx "+cx+ " cy "+cy);
       canvas.drag_el(cx, cy);
   }
}

canvas.rotate = function(element , dx ){
    var cxy = canvas.get_center(element);
    var ang = dx - cxy.x; 
    var transform = origTransform + (origTransform ? "r" : "r") + ang;
    element.attr({transform: transform });
};

canvas.select = function(id){
    
    var found = this.elements.find(function(element){ if (element.attr("id") == id){return element}; });
    if (found != null) {
        canvas.unselect()
        this.current_el = found;
        //this.set_element_front_of_all(found)
        dw_frame.draw(found);

        if (found.attr("type") == "path") { canvas.next_point = canvas.count_points_path(found) - 1}
        return found;     
    };
    if (found == null){
        return null;
    };
};

canvas.selecting = function(){
    var box_selector = canvas.current_el.getBBox()
    var box_el
    canvas.ungroupe(canvas.g, this.selected_el)
    
    this.elements.forEach(function(element, index){
        canvas.delete_simple_frame(element)
        box_el = element.getBBox()
        if ((element.attr("type")!="pointer")&&canvas.include(box_selector,box_el)){
            canvas.draw_simple_frame(element)
            canvas.selected_el.push(element)
            canvas.selected_el.push(element.simple_frame.top)
            canvas.selected_el.push(element.simple_frame.bottom)
            canvas.selected_el.push(element.simple_frame.left)
            canvas.selected_el.push(element.simple_frame.right)
            element.undrag()
        }
    })
    
    
    canvas.g = snap.group().add(canvas.selected_el)
    this.dragable(canvas.g);
}

canvas.ungroupe = function(groupe, elements){
    if ( (groupe == null)||( elements == null) ){ return null}
    var matrix = groupe.matrix
    elements.forEach( function(element, index){
        if (matrix != null ){
            var origTransform = element.transform().local;
            var transform = origTransform + (origTransform ? "T" : "t") + [matrix.e, matrix.f];
            element.attr({transform:transform});
        }
        snap.add(element)
        canvas.dragable(element)

    })
    canvas.g.remove()
    this.selected_el = []
}


canvas.draw_simple_frame = function (element){
    var box = element.getBBox()
    element.simple_frame = {}
    var frame = element.simple_frame
    var attr = {
        stroke: "#30839b",
        strokeWidth: '1', 
        class:"frame_node",
        'stroke-dasharray': '5,5' 
        }
    frame.top = snap.line(box.x,box.y,box.x2,box.y)
    frame.bottom = snap.line(box.x,box.y2,box.x2,box.y2)
    frame.left = snap.line(box.x,box.y,box.x,box.y2)
    frame.right = snap.line(box.x2,box.y,box.x2,box.y2)
    frame.top.attr(attr)
    frame.bottom.attr(attr)
    frame.left.attr(attr)
    frame.right.attr(attr)
    //console.log(element.simple_frame.g)
    //frame.g = snap.g(element, frame.top, frame.bottom, frame.left, frame.right)
    //element.undrag()
    //this.dragable(frame.g);
    //console.log(g)
    
} 

canvas.delete_simple_frame = function(element){
    var frame = element.simple_frame
    if (frame != null){
        frame.top.remove()
        frame.bottom.remove()
        frame.left.remove()
        frame.right.remove()
    }
}

canvas.include = function(box_selector, box_el){
    var el_left_top =     {x:box_el.x,  y:box_el.y}
    var el_right_top =    {x:box_el.x2, y:box_el.y}
    var el_right_bottum = {x:box_el.x2, y:box_el.y2}
    var el_left_bottum =  {x:box_el.x,  y:box_el.y2}

    var sel_left_top =     {x:box_selector.x,  y:box_selector.y}
    var sel_right_top =    {x:box_selector.x2, y:box_selector.y}
    var sel_right_bottum = {x:box_selector.x2, y:box_selector.y2}
    var sel_left_bottum =  {x:box_selector.x,  y:box_selector.y2}

    var left_top_include  = canvas.point_between(el_left_top, sel_left_top, sel_right_bottum )
    var right_top_include  = canvas.point_between(el_right_top, sel_left_top, sel_right_bottum )
    var right_bottum_include  = canvas.point_between(el_right_bottum, sel_left_top, sel_right_bottum )
    var left_bottum_include  = canvas.point_between(el_left_bottum, sel_left_top, sel_right_bottum )

    return (left_top_include||right_top_include||right_bottum_include||left_bottum_include)
}


canvas.point_between = function(point, begin, end){
    if ( ( point == null )||( begin == null )||( end == null ) ) { return  false }
    var x_between  = ( (point.x >= begin.x)&&(point.x <= end.x) )
    var y_between  = ( (point.y >= begin.y)&&(point.y <= end.y) )
    return (x_between&&y_between)
}

canvas.unselect = function(){
    this.current_el = null;
    this.next_point = null
    this.current_point_path = null
    dw_frame.remove(); 
};

canvas.delete = function(){
    var id = canvas.current_el.id 
    this.elements.find(function(element, index, array){
        if (element.id == id) {
         array.splice(index,1)
        
          }
    })
    this.next_point = null
    this.next_point = null
    this.current_el.remove(); 
    this.current_el.attr({unused: true});
    this.current_el = null;
    dw_frame.remove(); 
};

canvas.get_center = function(element){
    var box = element.getBBox();
    this.current_el_center = {x:box.cx, y:box.cy };
    return this.current_el_center; 
};

canvas.set_element_front_of_all = function(element){
    var last_el = this.last_element()
    if (last_el != null){
     element.before(last_el);        
    }

};

canvas.last_element = function(){
    var count_el = parseInt( snap.node.childElementCount );
    for(var i = count_el -1; i>1; i--){
        var last_el = snap.node.children[i];
        if ((last_el.attributes.class != null )&&(last_el.attributes.class.value == "figure")){
          var last_el_id = last_el.attributes.id.value;  
          var index = parseInt( last_el_id ) -1;
          i = 0;
          return this.elements[index];
      };
  };  

};

canvas.canculate_rel_point = function(point,element){ // for edit
    var matrix = element.matrix;
    
    if (matrix == null){ return point }
    var cxy = this.get_center(element);
    var mdx = cxy.x + (matrix.e-cxy.x)*matrix.a + (matrix.f - cxy.y)*matrix.b; 
    var mdy = cxy.y + (matrix.f-cxy.y)*matrix.a - (matrix.e - cxy.x)*matrix.b; 
    var new_x = parseInt(cxy.x + (point.x - cxy.x)*matrix.a + (point.y - cxy.y)*matrix.b - mdx);
    var new_y = parseInt(cxy.y + (point.y - cxy.y)*matrix.a - (point.x - cxy.x)*matrix.b - mdy);
    return {x:new_x, y:new_y};
};

canvas.with_matrix = function(point,element){ // for get frame
    var matrix = element.matrix;
    var new_x = matrix.e + point.x*matrix.a - point.y*matrix.b
    var new_y = matrix.f + point.y*matrix.a + point.x*matrix.b
    return {x:new_x, y:new_y}
}

canvas.canculate_matrix_transf = function(element){
    var matrix = element.matrix;
    var cxy = this.get_center(element);
    var mdx = cxy.x + (matrix.e-cxy.x)*matrix.a + (matrix.f - cxy.y)*matrix.b; 
    var mdy = cxy.y + (matrix.f-cxy.y)*matrix.a - (matrix.e - cxy.x)*matrix.b; 
    return {x:mdx, y:mdy};
};

canvas.canculate_distanse = function(point1,point2){
    return Math.sqrt(  (point1.x-point2.x)*(point1.x-point2.x) + (point1.y-point2.y)*(point1.y-point2.y) );
};




//************************* TESTS FUNCTIONS ************************************

