tool = {}

tool.init = function(){
    this.select("pointer")
}

tool.select = function(name){
    this.type = name
    this.css_buttons(name)
    switch (name){
        case 'pointer':
        this.css_pointer(true)
        break
        case 'line':
        this.css_pointer(false)
        break
        case 'circle':
        this.css_pointer(false)
        break
    }
}

tool.css_pointer  = function (on){
    if (on) {
        $("svg").css("cursor","default")  
        $(".figure").css("cursor", "move") 
    }else{
        $("svg").css("cursor","crosshair")
        $(".figure").css("cursor", "crosshair")
    } 
}
 
tool.css_buttons = function(name){
    $(".pointer").removeClass("active") 
    $(".line").removeClass("active") 
    $(".circle").removeClass("active") 

    switch (name){
        case 'pointer':
        $(".pointer").addClass("active") 
        break
        case 'line':
        $(".line").addClass("active") 
        break
        case 'circle':
        $(".circle").addClass("active") 
        break
    }
}
