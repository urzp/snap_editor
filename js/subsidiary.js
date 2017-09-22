canvas.arc_set_params = function(m_xy, r_xy, x_rotation, large_arc, sweep, end_xy, d){
	if (x_rotation == 0) { x_rotation = "0" };
	if (large_arc  == 0) { large_arc = "0" };
	if (sweep      == 0) { sweep = "0" }

	if (d != null){
		var d_spl =  d.split(/[MA, ]/)
		m_xy = m_xy     || {x:d_spl[1], y:d_spl[2]}
		r_xy = r_xy     || {x:d_spl[4], y:d_spl[5]}
		end_xy = end_xy || {x:d_spl[9], y:d_spl[10]}

		x_rotation = x_rotation || d_spl[6]
		large_arc = large_arc   || d_spl[7]
		sweep = sweep           || d_spl[8]
		
	}

	d = "M" + m_xy.x + "," + m_xy.y + " A" + r_xy.x +"," + r_xy.y + " "
	d += x_rotation + " "
	d += large_arc + " "
	d += sweep + " "
	d += end_xy.x + "," + end_xy.y

	return d 
}

canvas.arc_get_params = function(d){
	if (d != null){
		var d_spl =  d.split(/[MA, ]/)
		var m_xy = {x:parseInt(d_spl[1]), y:parseInt(d_spl[2])}
		var r_xy = {x:d_spl[4], y:d_spl[5]}
		var end_xy = {x:parseInt(d_spl[9]), y:parseInt(d_spl[10])}
		var x_rotation = parseInt(d_spl[6])
		var large_arc = d_spl[7]
		var sweep = d_spl[8]
		return {m_xy, r_xy, end_xy, x_rotation, large_arc, sweep}
	} else { return null }
}

canvas.path_get_params = function(d){
	var points =[], point, x, y
	var points_string =  d.split(/[MAL, ]/)
	var length  = points_string.length 
	$.each(points_string,function(index,val){
		if (val == ""){
			x = parseInt(points_string[index+1])
			y = parseInt(points_string[index+2])
			point = {x:x, y:y}
			points.push(point)
		}
	});

	return points
}

canvas.count_points_path = function(element){
	if (element.attr("type") == "path"){
		points = canvas.path_get_params(element.attr("d"))
		return points.length
	}
}

canvas.path_set_params = function(points){
	var d
	$.each(points,function(index,val){
		if (index == 0 ){ 
			d = "M" + val.x + " " + val.y  
		}else{
			d = d +" L" + val.x + " " + val.y 
		}	
	})
	return d
}

canvas.poligon_get_points = function(p){
	var arr = [], point, x, y
	var length = p.length 
	$.each(p,function(index,val){	
		if ((index < length - 1)&&((index % 2) == 0)){
			x = parseInt(p[index])
			y = parseInt(p[index+1])
			point = {x:x, y:y}
			arr.push(point)
		}
	});
	return arr
}

canvas.poligon_set_params = function(points){
	var p = []
	var length = points.length 
	$.each(points,function(index,val){
		p.push(val.x)
		p.push(val.y) 
	})
	return p

}

canvas.triangle_get_params = function(p){
	var p1 = {x:parseInt(p[0]), y:parseInt(p[1])} 
	var p2 = {x:parseInt(p[2]), y:parseInt(p[3])}
	var p3 = {x:parseInt(p[4]), y:parseInt(p[5])}
	return {p1:p1, p2:p2, p3:p3}
}

canvas.triangle_set_params = function(p1, p2, p3, p){
	if (p1){p[0] = p1.x; p[1] = p1.y}
	if (p2){p[2] = p2.x; p[3] = p2.y}
	if (p3){p[4] = p3.x; p[5] = p3.y}
	return p
}

canvas.get_center_big_circle = function(p1,p2,p3){
	var Xa = p1.x
	var Ya = p1.y
	var Xc = p2.x
	var Yc = p2.y
	var Xb = p3.x
	var Yb = p3.y

	var BC = (Xb*Xb+Yb*Yb-Xc*Xc-Yc*Yc)
	var CA = (Xc*Xc+Yc*Yc-Xa*Xa-Ya*Ya)
	var AB = (Xa*Xa+Ya*Ya-Xb*Xb-Yb*Yb)
	var denom =  Xa*(Yb-Yc)+Xb*(Yc-Ya)+Xc*(Ya-Yb) 

	var x0 = -(1/2)*(  Ya*BC + Yb*CA + Yc*AB )
	x0 = x0/denom
	var y0 = (1/2)*( Xa*BC + Xb*CA  + Xc*AB )
	y0 = y0/denom

	return {x:x0, y:y0}
}

canvas.get_center_small_circle = function(pA,pB,pC){
	var Xa = pA.x
	var Ya = pA.y
	var Xc = pC.x
	var Yc = pC.y
	var Xb = pB.x
	var Yb = pB.y

	var a = get_distanse(pC,pB)
	var b = get_distanse(pA,pC)
	var c = get_distanse(pA,pB)
	var p = a+b+c 

	var x0 = parseInt( ( a*Xa + b*Xb + c*Xc )/p )
	var y0 = parseInt( ( a*Ya + b*Yb + c*Yc )/p )
	return {x:x0, y:y0}
}


get_radius_circ = function(beg, end, p){
	var ep = get_distanse(end, p)
	var bp = get_distanse(beg,p)
	var be = get_distanse(beg, end)
	var half_l = (ep+bp+be)/2
	var h = 2*Math.sqrt(half_l*((half_l-be)*(half_l-bp)*(half_l-ep)))/be
	var sin_e = h/ep
	return bp/ (2*sin_e)
}

get_h = function(r,d){
	return parseInt( (r + Math.sqrt( 4*(r*r) - d*d ) / 2) )
}

get_center_line = function(p1,p2){
	var x = parseInt( p1.x + (p2.x - p1.x)/2 )
	var y = parseInt( p1.y + (p2.y - p1.y)/2 )
	return {x:x, y:y}
}

get_angle_line =function(beg, end){
	var b_e = get_distanse( beg, end )
	var cos = (end.x - beg.x)/b_e
	var sin = (end.y - beg.y)/b_e
	var ang = Math.acos(cos)
	if (end.y < beg.y ) { ang = 2*Math.PI - ang}
	var ang_deg = deg(ang)
	return {cos: cos, sin: sin, ang:ang, ang_deg: ang_deg}
}

get_distanse = function(point1,point2){ 
    return Math.sqrt(  (point1.x-point2.x)*(point1.x-point2.x) + (point1.y-point2.y)*(point1.y-point2.y) );
};

get_rotate = function(point , center, angle_d ){
	var r = get_distanse(point, center )
	var ang_beg = get_angle_line(point, center).ang_deg  + 270
	var new_x = parseInt(center.x + r * Math.sin( rad(angle_d + ang_beg) ))
	var new_y = parseInt(center.y - r * Math.cos( rad(angle_d + ang_beg) ))
	return {x:new_x ,y:new_y}
}

get_xy = function(){
    var x_el = parseInt(  $( "#svg" ).offset().left );
    var y_el = parseInt(  $( "#svg" ).offset().top  );
    var x = event.pageX - x_el;
    var y = event.pageY - y_el;
    return {x: x, y: y};
};

deg = function(angle){
    return angle * (180 / Math.PI);
};

rad = function(angle){
    return angle * ( Math.PI/ 180);
};

print_pos_mose = function(){
    mose = get_xy()
    console.log("x " + mose.x + " y " + mose.y)
}

//+++++++++++++++++++++++++++++++++++++++++++++ tests +++++++++++++++++++++++++++++++++++


