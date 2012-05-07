/*
@author Matt Crinklaw-Vogt
*/
define(["common/Throttler"], function(Throttler) {
  var SlideDrawer;
  return SlideDrawer = (function() {
    /* TODO: how she we handle slide sizes and scaling?
    		# Fixed slide size?  Slide size = size of editor . . . ?
    		# We'll have to re-visit this when we start testing the impress export.
    */
    var haxTempSlideSize;

    haxTempSlideSize = {
      width: 1024,
      height: 768
    };

    function SlideDrawer(model, g2d) {
      this.model = model;
      this.g2d = g2d;
      this.model.on("change", this.repaint, this);
      this.size = {
        width: this.g2d.canvas.width,
        height: this.g2d.canvas.height
      };
      console.log(this.size);
      this.throttler = new Throttler(600, this);
      this.scale = this.size.width / haxTempSlideSize.width;
    }

    SlideDrawer.prototype.resized = function(newSize) {
      this.size = newSize;
      this.scale = this.size.width / haxTempSlideSize.width;
      return this.repaint();
    };

    SlideDrawer.prototype.repaint = function() {
      return this.throttler.submit(this.paint, {
        rejectionPolicy: "runLast"
      });
    };

    SlideDrawer.prototype.paint = function() {
      var components,
        _this = this;
      this.g2d.clearRect(0, 0, this.size.width, this.size.height);
      components = this.model.get("components");
      return components.forEach(function(component) {
        var type;
        type = component.constructor.name;
        _this.g2d.save();
        /*
        				# TODO: figure out correct translation to apply after transforms
        				skewX = component.get("skewX")
        				skewY = component.get("skewY")
        				transform = [1,0,0,1,0,0]
        				if skewX
        					transform[1] = skewX
        				if skewY
        					transform[2] = skewY
        				@g2d.transform.apply(@g2d, transform)
        
        				rotate = component.get("rotate")
        				if rotate
        					@g2d.rotate(rotate)
        */
        switch (type) {
          case "TextBox":
            _this.paintTextBox(component);
            break;
          case "Image":
            _this.paintImage(component);
            break;
          case "Table":
            _this.paintTable(component);
            break;
          case "Image":
            _this.paintImage(component);
        }
        return _this.g2d.restore();
      });
    };

    SlideDrawer.prototype.paintTextBox = function(textBox) {
      this.g2d.fillStyle = "#" + textBox.get("color");
      this.g2d.font = textBox.get("size") * this.scale + "px " + textBox.get("family");
      return this.g2d.fillText(textBox.get("text"), textBox.get("x") * this.scale, textBox.get("y") * this.scale + textBox.get("size") * this.scale);
    };

    SlideDrawer.prototype.paintImage = function() {};

    SlideDrawer.prototype.paintTable = function() {};

    SlideDrawer.prototype.paintImage = function() {};

    SlideDrawer.prototype.dispose = function() {
      return this.model.off("change", this.repaint, this);
    };

    return SlideDrawer;

  })();
});