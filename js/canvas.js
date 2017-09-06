
canvas = {
    elements:[],
    current_el:{},
    count:0
};

canvas.init = function(){
    snap = Snap("#svg");
    this.events();
};


canvas.dragable = function(element){
    dragMove = function(dx, dy, ev, x, y) {
        var transform = origTransform + (origTransform ? "T" : "t") + [dx, dy];
        element.attr({ transform: transform });
        dw_frame.draw(canvas.current_el);     
    }

    beforeMove = function(){
        origTransform = element.transform().local;
    };

    element.drag(dragMove, beforeMove);
};

canvas.draw = function(type){
    var element = null;
    this.count++;
    var cursor = get_xy();
    if (type == 'line'){
       element = snap.line(cursor.x, cursor.y, cursor.x, cursor.y);   
       element.attr({
        stroke: "#000",
        strokeWidth: '2'});
   };
   if (type == 'rectangle'){
       element = snap.rect(cursor.x, cursor.y, 10, 10); 
       element.attr({
        fill:"none",
        stroke:"#000",
        strokeWidth: '2'});    
   }; 
   if (type == 'circle'){
       element = snap.circle(cursor.x, cursor.y,4); 
       element.attr({
        fill:"none",
        stroke:"#000",
        strokeWidth: '2'});      
   }; 
   if (type == 'ellipse'){
       element = snap.ellipse(cursor.x, cursor.y,4,4); 
       element.attr({
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
        fill:"none",
        stroke:"#000",
        strokeWidth: '2' });      
   };       

   element.attr({id: this.count, class: "figure"});
   this.elements.push(element);
   this.current_el = element;
   this.dragable(element);
   return element;  
};

canvas.draw_end = function(shift){ 
    var element = this.current_el;
    var cursor = get_xy();
    if (element.type == "line"){
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
    if (element.type == "rect"){
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
    if (element.type == "circle"){
        var cx = parseInt(this.current_el.attr("cx")); 
        var cy = parseInt(this.current_el.attr("cy")); 
        var x = get_xy().x;
        var y = get_xy().y;
        var rx = Math.abs(cx - x);
        var ry = Math.abs(cy - y);
        var r = Math.sqrt( Math.pow(rx,2) + Math.pow(ry,2) );
        element.attr({ r:r });
    };
    if (element.type == "ellipse"){
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
    if (element.type == "path"){

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
        this.current_el = found;
        found.before(this.last_element()); 
        dw_frame.draw(found);
        return found;     
    };
    if (found == null){
        return null;
    };
};

canvas.unselect = function(){
    this.current_el = null;
    dw_frame.remove(); 
};

canvas.delete = function(){
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

canvas.last_element = function(){
    var count_el = parseInt( snap.node.childElementCount );
    for(var i = count_el -1; i>1; i--){
        var last_el = snap.node.children[i];

        if (last_el.attributes.class.value == "figure"){
          var last_el_id = last_el.attributes.id.value;  
          var index = parseInt( last_el_id ) -1;
          i = 0;
          return this.elements[index];
      };
  };  

};

canvas.canculate_rel_point = function(point,element){
    var matrix = element.matrix;
    var cxy = this.get_center(element);
    var mdx = cxy.x + (matrix.e-cxy.x)*matrix.a + (matrix.f - cxy.y)*matrix.b; 
    var mdy = cxy.y + (matrix.f-cxy.y)*matrix.a - (matrix.e - cxy.x)*matrix.b; 
    var new_x = parseInt(cxy.x + (point.x - cxy.x)*matrix.a + (point.y - cxy.y)*matrix.b - mdx);
    var new_y = parseInt(cxy.y + (point.y - cxy.y)*matrix.a - (point.x - cxy.x)*matrix.b - mdy);
    return {x:new_x, y:new_y};
};

canvas.with_matrix = function(point,element){
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

