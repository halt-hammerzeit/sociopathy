/**
 * Text Shadow
 * 
 * This script enables some text-shadow animation functionality in jQuery.
 * For example, you can make some text glow.
 * 
 * Usage:
 * 
 * in html:
 * 
 * <span id="glowing">putin</span>
 * 
 * in css:
 * 
 * #putin
 * {
 *		color: #a50000;
 *		text-shadow: rgba(255, 0, 0, 0.1) 0 0 20px;
 * }
 * 
 * in javascript:
 * 
 * element.glow()
 * 
 * Requires jQuery. 
 * 
 * Distributed under GNU General Public License
 * http://www.gnu.org/licenses/gpl.html
 * 
 * @author Kuchumov Nikolay
 * @email kuchumovn@gmail.com
 * @github kuchumovn
 */

// text-shadow radius

$.cssHooks['text_shadow_radius'] = 
{
	get: function(element, computed, extra) 
	{
		return parse_text_shadow($(element)).radius
	},
	
	set: function(element, radius) 
	{
		var parameters = parse_text_shadow($(element))
		parameters.radius = radius
		
		$(element).css({'text-shadow': to_text_shadow(parameters)})
	}
}

$.fx.step['text_shadow_radius']  = function(fx) 
{
	$.cssHooks['text_shadow_radius'].set(fx.elem, fx.now + fx.unit);
}

// text-shadow opacity

$.cssHooks['text_shadow_opacity'] = 
{
	get: function(element, computed, extra) 
	{
		return parse_text_shadow($(element)).color.alpha()
	},
	set: function(element, opacity) 
	{
		var parameters = parse_text_shadow($(element))
		parameters.color = set_opacity(parameters.color, parseFloat(opacity))
	
		$(element).css({'text-shadow': to_text_shadow(parameters)})
	}
}

$.fx.step['text_shadow_opacity']  = function(fx) 
{
	$.cssHooks['text_shadow_opacity'].set(fx.elem, fx.now + fx.unit);
}

// utility functions

function set_opacity(color, opacity)
{
	return $.Color
	([
		color.red(), 
		color.green(), 
		color.blue(), 
		opacity
	])
}

function print_rgba(color)
{
	return "rgba(" + color.red() + ", " + color.green() + ", " + color.blue() + ", " + color.alpha() + ")"
}

function to_text_shadow(parameters)
{
	return print_rgba(parameters.color) + ' ' + parameters.left + ' ' + parameters.top + ' ' + parameters.radius
}

function parse_text_shadow(element)
{
	var text_shadow = element.css('text-shadow')
	var parts = text_shadow.split(' ')
	
	var radius = parts.pop()
	var top = parts.pop()
	var left = parts.pop()
	var color = $.Color($.trim(parts.join(' ')))
	
	return { color: color, left: left, top: top, radius: radius }
}

// glow plugin

(function($)
{
	var glow_timing = 1000
	
	var minimum_opacity = 0.3
	var maximum_opacity = 0.8
			
	$.fn.glow = function()
	{
		glow_in_out.bind(this)()
		return this
	}
	
	function glow_in_out()
	{
		this.animate({text_shadow_opacity: maximum_opacity}, glow_timing)
		this.animate({text_shadow_opacity: minimum_opacity}, glow_timing, glow_in_out.bind(this))
	}
	
	$.fn.glow_in = function()
	{
		this.animate({text_shadow_opacity: 1}, glow_timing)
	}
	
	$.fn.glow_out = function()
	{
		// 0.001 to keep color data
		this.animate({text_shadow_opacity: 0.01}, glow_timing)
	}
})(jQuery)