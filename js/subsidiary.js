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
		var m_xy = {x:d_spl[1], y:d_spl[2]}
		var r_xy = {x:d_spl[4], y:d_spl[5]}
		var end_xy = {x:d_spl[9], y:d_spl[10]}
		var x_rotation = parseInt(d_spl[6])
		var large_arc = d_spl[7]
		var sweep = d_spl[8]
		return {m_xy, r_xy, end_xy, x_rotation, large_arc, sweep}
	} else { return null }
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


