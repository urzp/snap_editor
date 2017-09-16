
canvas.test_arc_set_params = function(){
	var m_xy = {x:10,y:10}
	var r_xy = {x:20,y:20}
	var end_xy = {x:10,y:20}
	var x_rotation = 0
	var large_arc = 0
	var sweep = 0 
	console.log(this.arc_set_params(m_xy, r_xy, x_rotation, large_arc, sweep, end_xy) )
}

canvas.test_arc_set_params_2 = function(){
	var m_xy = {x:50,y:50}

	var end_xy = {x:100,y:200}
	var x_rotation = 0
	var large_arc = 1
	var sweep = 0 
	var d = "M10,10 A20,20 1 0 0 10,20"
	console.log(d)
	console.log(this.arc_set_params(m_xy, null, x_rotation, large_arc, null, end_xy, d) )
}


print_pos_mose = function(){
    mose = get_xy()
    console.log("x " + mose.x + " y " + mose.y)
}



canvas.matrix_data = function(){
    var cxy = this.get_center(this.current_el);
    var matrix =this.current_el.matrix;
    
    var x1rot = parseInt( dw_frame.nodes.left_top.attr("cx") );
    var y1rot = parseInt( dw_frame.nodes.left_top.attr("cy") );

    var mdx = parseInt( cxy.x + (matrix.e-cxy.x)*matrix.a + (matrix.f - cxy.y)*matrix.b );
    var mdy = parseInt( cxy.y + (matrix.f-cxy.y)*matrix.a - (matrix.e - cxy.x)*matrix.b );

    var nx = parseInt( cxy.x + (x1rot-cxy.x)*matrix.a + (y1rot - cxy.y)*matrix.b ); 
    var ny = parseInt( cxy.y + (y1rot - cxy.y)*matrix.a - (x1rot-cxy.x)*matrix.b );

    console.log("angle "+ this.current_el.attr("angle")); 
    console.log("x1 "+ this.current_el.attr("x") + "  x1rot " + x1rot + " nx "+ nx + " mdx " + mdx); 
    console.log("y1 "+ this.current_el.attr("y") + "  y1rot " + y1rot + " ny "+ ny + " mdy " + mdy); 
    console.log("matrix")
    console.log("a:" + deg(Math.acos(matrix.a)) +" "+ matrix.a );
    console.log("b:" + deg(Math.asin(matrix.b)) +" "+ matrix.b );
    console.log("c:" + deg(Math.asin(matrix.c)) +" "+ matrix.c );
    console.log("d:" + deg(Math.acos(matrix.d)) +" "+ matrix.d );
    console.log("e:" + matrix.e );
    console.log("f:" + matrix.f );
};



canvas.test_move = function(nx,ny){
    var element =this.current_el;
    var matrix = element.matrix;
    var new_point;
    var cxy = canvas.get_center(element);
    var x = parseInt(element.attr("x")); 
    var y = parseInt(element.attr("y"));
    var w = parseInt(element.attr("width")); 
    var h = parseInt(element.attr("height")); 

    //var new_point = {x: x - dx, y: y - dy}
    var new_point = {x:nx, y:ny};

    var new_point_rel = canvas.canculate_rel_point(new_point, element);

    
    width = w  + (x - new_point_rel.x);
    height = h + (y - new_point_rel.y);


    element.attr({
        width: width,
        height: height,
        x: new_point_rel.x,
        y: new_point_rel.y
    });

};

canvas.test_arc_set_params = function(){
	var m_xy = {x:10,y:10}
	var r_xy = {x:20,y:20}
	var end_xy = {x:10,y:20}
	var x_rotation = 0
	var large_arc = 0
	var sweep = 0 
	console.log(this.arc_set_params(m_xy, r_xy, x_rotation, large_arc, sweep, end_xy) )
}

canvas.test_arc_set_params_2 = function(){
	var m_xy = {x:50,y:50}

	var end_xy = {x:100,y:200}
	var x_rotation = 0
	var large_arc = 1
	var sweep = 0 
	var d = "M10,10 A20,20 1 0 0 10,20"
	console.log(d)
	console.log(this.arc_set_params(m_xy, null, x_rotation, large_arc, null, end_xy, d) )
}


canvas.tets_arc = function(x,y){
    var d = this.current_el.attr("d"); 
    var params = canvas.arc_get_params(d)
    var r_xy = { x:x, y:y}
    d = canvas.arc_set_params(null, r_xy, null, null, null, null, d )
    this.current_el.attr({ d:d });

}

dw_frame.coordinats = function(){
    var left_top = { x: parseInt(this.nodes.left_top.attr("cx")),
    y: parseInt(this.nodes.left_top.attr("cy")) };
    var right_top = { x: parseInt(this.nodes.right_top.attr("cx")),
    y: parseInt(this.nodes.right_top.attr("cy")) }; 
    var right_bottom = { x: parseInt(this.nodes.right_bottom.attr("cx")),
    y: parseInt(this.nodes.right_bottom.attr("cy")) };
    var left_bottom = { x: parseInt(this.nodes.left_bottom.attr("cx")),
    y: parseInt(this.nodes.left_bottom.attr("cy")) }; 
    var rotate = { x: parseInt(this.nodes.rotate.attr("cx")),
    y: parseInt(this.nodes.rotate.attr("cy")) };   

    console.log( "left_top " + "x: " + left_top.x + " y: " + left_top.y);
    console.log( "right_top " + "x: " + right_top.x + " y: " + right_top.y);
    console.log( "right_bottom " + "x: " + right_bottom.x + " y: " + right_bottom.y);
    console.log( "left_bottom " + "x: " + left_bottom.x + " y: " + left_bottom.y);
};

test_rotate = function(){
	var point = {x: 100, y: 10}
	var centr = {x: 100, y: 100}
	var ang = 0

	var point2 = get_rotate(point, centr, ang)
	console.log("p: x=" +point.x +"  y=" + point.y + " cent: x=" + centr.x + " y=" + centr.y + " ang=" + ang + " new_point x=" + point2.x + " y=" + point2.y)
	ang = 90
	var point2 = get_rotate(point, centr, ang)
	console.log("p: x=" +point.x +"  y=" + point.y + " cent: x=" + centr.x + " y=" + centr.y + " ang=" + ang + " new_point x=" + point2.x + " y=" + point2.y)
	ang = 180
	var point2 = get_rotate(point, centr, ang)
	console.log("p: x=" +point.x +"  y=" + point.y + " cent: x=" + centr.x + " y=" + centr.y + " ang=" + ang + " new_point x=" + point2.x + " y=" + point2.y)
		ang = 270
	var point2 = get_rotate(point, centr, ang)
	console.log("p: x=" +point.x +"  y=" + point.y + " cent: x=" + centr.x + " y=" + centr.y + " ang=" + ang + " new_point x=" + point2.x + " y=" + point2.y)

}

test_h = function(){
	var b ={x:0, y:3.12}
	var e ={x:5, y:3.12}
	var p ={x:2.5, y:0}
	get_radius_circ(b,e,p)
}


test_between = function(){
	var p = {x: 10, y: 10}
	var b = {x: 5, y: 5}
	var e = {x:20, y: 20}
	var res = canvas.point_between(p,b,e)
	console.log(res)

	var p = {x: 10, y: 10}
	var b = {x: 15, y: 5}
	var e = {x:20, y: 20}
	var res = canvas.point_between(p,b,e)
	console.log(res)

	var p = null
	var b = {x: 5, y: 5}
	var e = {x:20, y: 9}
	var res = canvas.point_between(p,b,e)
	console.log(res)
}