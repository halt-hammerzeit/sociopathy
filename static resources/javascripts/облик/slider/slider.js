/**
 * Slider
 * 
 * This script creates a slider from predefined div frames.
 * 
 * Usage:
 * 
 * In html:
 * 
 * <div id="the_slider" class="slider">
 *		<div class="slide">
 *			La la la
 *		</div>
 *			
 *		<div class="slide">
 *			Vodka
 *		</div>
 * 	</div>
 *
 * In javascript:
 * 
 *	$(function()
 *	{
 *		var the_slider = new slider
 *		({
 *			id: "the_slider",
 *			"previous button": $("#previous"),
 *			"next button": $("#next"),
 *			"done button": $("#done"),
 *			fader: button.fader, // if you have it included
 *		});
 *
 *		the_slider.activate();
 *	});
 *
 * In Css:
 * 
 * #the_slider
 * {
 *			width: 560px;
 *			height: 263px;
 * }
 * 
 * The stylesheet is included ('slider.css')
 * 
 * Requires jQuery. 
 * 
 * Copyright (c) 2010 Nikolay Kuchumov
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 * 
 * @author Kuchumov Nikolay
 * @email kuchumovn@gmail.com
 * @github kuchumovn
 */

function slider(options)
{
	var self = this
	
//	var fade_duration = 400
	
	this.index = 1
	
	this.options = options
		
	/**
	 * constructor
	 */
	this.initialize = function()
	{
		if (this.options.selector)
			this.$element = $(this.options.selector)
		else
			this.$element = this.options.element
			
		var $slides = this.$element.children()
		this.count = $slides.length
		
		this.slides = {}
		var slider = this
		
		var index = 1
		$slides.each(function()
		{
			slider.slides[index] = $(this).attr('name')
			index++
		})
		
		// get dimensions
		
		this.options.width = this.$element.parent().width()
		this.options.height = this.$element.parent().height()

		// create the strip
		
		$slides.wrapAll('<div></div>')
		this.$strip = $(':first', this.$element)
		this.$strip.css
		({
			width: this.options.width * this.count + 'px',
			height: this.options.height + 'px'
		})

		// size the container
		this.$element.width(this.options.width)
		this.$element.height(this.options.height)
		
		// size the slides
		var width = this.options.width
		var height = this.options.height
		
		$slides.each(function()
		{
			var slide = $(this)
			slide.width(width - parseInt(slide.css('padding-left')) - parseInt(slide.css('padding-right')))
			slide.height(height - parseInt(slide.css('padding-top')) - parseInt(slide.css('padding-bottom')))
		})

		this.$element.prepend($('<div/>').addClass('left_border'))
		this.$element.append($('<div/>').addClass('right_border'))
		
		// adjust controls visibility
		this.hide_or_show_controls({ immediately: true })
		
		// set up buttons
//		if (!this.options.buttons.previous.does())
//			this.options.buttons.previous.does(this.next(), '1x')
	}
	
	this.on = function(event, handler)
	{
		this.$element.on(event, handler)
	}
	
	// go to slide
	this.go_to = function(index, callback)
	{
		// out of bounds. exit
		if (index < 1 || index > this.count)
			return
			
		// set index
		this.index = index
		
		this.slide_out = function()
		{
			this.slide_in = function()
			{
				// perform scrolling, refresh buttons
				this.scroll(callback)
				this.hide_or_show_controls()
			}
			
			this.$element.trigger('slide_in', this.slides[index])
		}
		.bind(this)
		
		this.$element.trigger('slide_out', this.slides[index - 1])
		
		if (!this.options.asynchronous)
		{
			this.slide_out()
			this.slide_in()
		}
	}
	
	// next slide
	this.next = function(callback)
	{
		// if we are in the end - push the done button
		if (this.index == this.count)
		{
			this.options.buttons.done.push()
			return callback()
		}
				
		// go to the next slide	
		this.go_to(this.index + 1, callback)
	}
	
	// previous slide
	this.previous = function()
	{
		// if we are in the beginning - push the cancel button
		if (this.index == 1)
			this.options.buttons.cancel.push()
	
		// go to the previous slide	
		this.go_to(this.index - 1)
	}
		
	// smoothly move the strip using margin-left
	this.scroll = function(callback)
	{
		// the new scrolling property
		var marginLeft = -this.options.width * (this.index - 1) + 'px'

		// if no need to animate - just set the new scrolling property
		if (this.no_animation)
			return this.$strip.css({ marginLeft: marginLeft })

		// else - animate
		animator.roll_left(this.$strip, marginLeft, { callback: callback })
	}
	
	// Hides and shows controls depending on current position
	this.hide_or_show_controls = function(options)
	{
		// options
		options = options || {}
		
		// if no one sees - don't animate
		if (options.immediately) 
			this.no_animation = true
		
		// if there's only one slide - that's a special case
		if (this.count < 2)
			this.singleton()

		// determine whether we are at the beginning, ending or elsewhere
		if (this.index == 1)
			this.beginning()
		else if (this.index == this.count)
			this.ending()
		else
			this.elsewhere()

		// from now on - animate
		if (options.immediately) 
			this.no_animation = false
	}
	
	// if we are at the start
	this.beginning = function()
	{
		this.hide_button("previous")
		this.switch_buttons({ from: "done", to: "next" })
	}

	// if we are in the end				
	this.ending = function()
	{
		this.show_button("previous")
		this.switch_buttons({ from: "next", to: "done" })
	}
	
	// if we are elsewhere
	this.elsewhere = function()
	{
		this.show_button("previous")
		this.switch_buttons({ from: "done", to: "next" })
	}
	
	// if there is only one slide		
	this.singleton = function()
	{
		this.hide_button("previous")
		this.switch_buttons({ from: "next", to: "done" })
	}
	
	// get button
	this.get_button = function(name) { return this.options.buttons[name] }
	
	// show a button
	this.show_button = function(name, callback)
	{
		// get the button by name
		var button = this.get_button(name)
		
		// if the button doesn't exist - exit
		if (!button)
			return
			
		// executes the call back function
		var execute_callback = function() { if (callback) callback() }
		
		// if no need to animate
		if (this.no_animation)
		{
			// show the button immediately
			button.show()
			
			execute_callback()
			
			// exit
			return
		}

		// else - animate the button (lock before the animation, and unlock after the animation)
		button.show_animated(callback)
	}
	
	// hide a button
	this.hide_button = function(name, callback)
	{
		// get the button by name
		var button = this.get_button(name)
	
		// if the button doesn't exist - exit
		if (!button)
			return
		
		// if no need to animate
		if (this.no_animation)
		{
			// show the button immediately
			button.hide()
			
			if (callback)
				callback()
			
			// exit
			return
		}

		// else - animate the button (lock before the animation, and unlock after the animation)
		button.hide_animated(callback)
	}
	
	// hide one button and show the other button
	this.switch_buttons = function(options)
	{
		// animate
		this.hide_button(options.from, function() { self.show_button(options.to) })
	}
	
	// reset state
	this.reset = function()
	{
		this.index = 1
		this.$strip.css('margin-left', 0)
		this.hide_or_show_controls({ immediately: true })
	}
	
	// call the constructor
	this.initialize()
}