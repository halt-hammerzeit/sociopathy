var first_time_page_loading = true

var пользователь = null
			
var panel
var content

var page

var host = parseUri().host
var Options =
{
	Upload_server_port: 8091,
	Websocket_server: host + ':8080',
	User_is_online_for: 8 * 60,
	Book_shelf_size: 6,
	Minimum_book_shelves: 3,
	Video:
	{
		Icon:
		{
			Size:
			{
				Width: 640
			}
		},
		Size:
		{
			Width: 560,
			Height: 315
		}
	}
}

if (путь_страницы() === 'сеть' || путь_страницы().starts_with('сеть/'))
	if (!$.cookie('user'))
		window.location = '/'

$(function()
{
	loading_page()

	Page.element = $('#page')

	подгрузить_шаблоны(function(ошибка)
	{
		if (ошибка)
			return
			
		вставить_общее_содержимое(function()
		{
			navigate_to_page()
		
			check_browser_support()
		})
	})
})

$(document).on('page_initialized', function()
{
	activate_anchors()
	ajaxify_internal_links(Page.element)
	
	if (page.Data_store.что)
		page.Data_store.load(function(data)
		{
			page.Data_store.populate(data)
			page_initialized()
		})
	else
		page_initialized()
})

$(document).on('page_loaded', function()
{
	var after_styles = function()
	{
		page.full_load(function()
		{
			ajaxify_internal_links()
		
			$(document).trigger('display_page')

			page_loaded()
			
			$('.non_selectable').disableTextSelect()
			
			go_to_anchor()
			
			navigating = false
		})
	}
	
	if (first_time_page_loading)
	{
		$.getScript('/javascripts/less.js', function()
		{
			if (пользователь)
				$('#logo').remove()
		
			panel = new Panel()
			
			$(document).trigger('panel_loaded')
			   
			panel.highlight_current_page()

			if (first_time_page_loading && пользователь)
			{
				//$(document).on('ether_is_online', function()
				after_styles()
			}
			else
			{
				after_styles()
			}
		})

		$(window).on('popstate', function()
		{
			if (!history_stacked)
				return
			
			navigate_to_page()
		})
	}
	else
	{
		//console.log(get_page_less_style_link())
		Less.load_style(add_version(get_page_less_style_link()), after_styles)
	}
})

var Пользовательские_настройки_по_умолчанию =
{
	Клавиши:
	{
		Режимы:
		{
			Обычный: ['Alt', 'Shift', '1'],
			Правка: ['Alt', 'Shift', '2'],
			Действия: ['Alt', 'Shift', '3']
		},
		Действия:
		{
			Создать: ['Ctrl', 'Alt', 'N'],
			Удалить: ['Ctrl', 'Alt', 'Backspace']
		},
		Писарь:
		{
			Разрывный_пробел: ['Ctrl', 'Shift', 'Пробел']
		},
		Вход: ['Ctrl', 'Alt', 'L']
	}
}

var Настройки = Пользовательские_настройки_по_умолчанию

function применить_пользовательские_настройки(настройки)
{
	Настройки = {}
	Object.x_over_y(Пользовательские_настройки_по_умолчанию, Настройки)
	Object.x_over_y(настройки, Настройки)
}

$(document).on('authenticated', function(event, данные)
{
	применить_пользовательские_настройки(данные.session.настройки)
})