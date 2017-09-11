canvas.fill_element = function(){
    if (canvas.current_el.attr("fill") == "none"){
        canvas.current_el.attr({fill: "#000"})
    } else {
        canvas.current_el.attr({fill: "none"})
    }
}

canvas.complite_path = function(){
    canvas.next_point = null
    canvas.current_point_path = null
    dw_frame.draw(canvas.current_el)
}

canvas.resume_path = function(){
	var element = canvas.current_el
	if (element.attr("type") == "path"){
		tool.select('path') 
		var points = canvas.path_get_params(element.attr("d"))
		canvas.next_point = points.length - 1
		canvas.current_point_path = canvas.next_point
	}
	if (element.attr("type") == "polygon"){
		tool.select('polygon') 
		var points = element.attr("points")
		canvas.next_point = points.length/2 - 1
		canvas.current_point_path = canvas.next_point
	}


	dw_frame.draw(element);
}