(function()
{
	Режим.пообещать('правка')
	
	var заметка = page.data.заметка
		
	var visual_editor
	
	function get_title()
	{
		return page.title.text().trim()
	}
	
	function set_title(title)
	{
		return page.title.text(title)
	}
	
	page.load_data(new Data_loader
	({
		url: '/читальня/заметка',
		parameters: { _id: page.data.заметка },
		get_data: function(data)
		{
			title(data.заметка.название)
		   
			page.Data_store.unmodified_data =
			{
				название: data.заметка.название,
				содержимое: data.заметка.содержимое
			}
			
			page.data.версия = data.заметка.версия
			
			page.data.заметка = data.заметка
			
			return data.заметка
		}
	}))
	
	page.data_templater_options = 
	{
		render: function() {},
		show: function() {},
	}
	
	page.load = function()
	{
		page.подсказка('правка заметки', 'Вы можете править эту заметку, перейдя в <a href=\'/помощь/режимы#Режим правки\'>«режим правки»</a> (клавиша «' + Настройки.Клавиши.Режимы.Правка + '»)')
	
		function get_breadcrumbs()
		{
			var link = text('pages.library.url')
			
			//var crumbs = [{ title: text('pages.library.title'), link: link }]
			var crumbs = []
			
			page.data.путь_к_заметке.split('/').forEach(function(раздел_или_заметка)
			{
				link += '/' + раздел_или_заметка
				crumbs.push({ title: раздел_или_заметка , link: link })
			})
			
			return crumbs
		}

		breadcrumbs(get_breadcrumbs())
		
		page.title = page.get('.breadcrumbs > span:last')
		
		page.title.attr('editable', true)
		
		set_title(page.data.заметка.название)
		
		page.get('article > section').html(Markup.decorate(page.data.заметка.содержимое,
		{
			syntax: 'html',
			
			process_element: function(decorated, wiki)
			{
				decorated.attr('author', wiki.attr('author'))
			}
			
		}))

		postprocess_rich_content(page.get('article > section'))
		
		initialize_editor()
		
		Режим.разрешить('правка')
		
		function delete_article()
		{
			if (!confirm('Удалить эту заметку в корзину?\nСейчас пока не сделано восстановление из корзины, поэтому мы спрашиваем.'))
				return

			page.Ajax.delete('/сеть/читальня/заметка',
			{
				_id: page.data.заметка
			})
			.ok(function(data)
			{
				go_to(text('pages.library.url') + '/' + data.путь_к_разделу)
			})
		}
	}
	
	page.unload = function()
	{
		if (visual_editor)
			visual_editor.unload()
	}
	
	var Tools_fade_duration = 0.05
	
	function initialize_editor()
	{
		visual_editor = new Visual_editor('.main_content > article > section')
	
		// изначально в режиме просмотра - отключить снасти
		visual_editor.unbind()
		
		visual_editor.initialize_tools_container()
		visual_editor.tools_element.floating_top_bar()
		
		visual_editor.tools_element.on('floats.floating_top_bar', function()
		{
			$(this).parent().css('position', 'static')
		})
		
		visual_editor.tools_element.on('unfloats.floating_top_bar', function()
		{
			$(this).parent().css('position', 'relative')
		})
		
		visual_editor.submit = function()
		{
			page.Data_store.save_changes()
		}
		
		visual_editor.can_edit = function() { return Режим.правка_ли() }
		
		visual_editor.keep_cursor_on_screen()
		
		var tools_height
		
		$('.visual_editor_tools_container').hide()
		
		Режим.при_переходе({ в: 'правка' }, function()
		{
			visual_editor.activate_tools_inside_content()
			visual_editor.editor.content.editable()
			
			$('.visual_editor_tools_container').fade_in(Tools_fade_duration)
			
			if (!tools_height)
			{
				tools_height = $('.visual_editor_tools_container').outerHeight(true)
				
				visual_editor.show_tools({ duration: 0 })
			}
			
			прокрутчик.scroll_by(tools_height)

			if (bowser.mozilla)
				visual_editor.editor.content.focus()
			
			visual_editor.editor.caret.move_to(visual_editor.editor.content.find('> *:first'))
		})
		
		Режим.при_переходе({ из: 'правка' }, function()
		{
			//visual_editor.hide_tools({ duration: 0 })
			
			$('.visual_editor_tools_container').fade_out(Tools_fade_duration, function()
			{
				прокрутчик.scroll_by(-tools_height)
			})

			visual_editor.unbind()
			visual_editor.editor.content.not_editable()
		})
		
		// при нажатии Ввода на основном заголовке - перейти к первому абзацу
		/*
		page.title.on('keypress', function(event)
		{
			if (!Режим.правка_ли())
				return
				
			if (Клавиши.is('Enter', event))
			{
				event.preventDefault()
				visual_editor.editor.move_caret_to(visual_editor.editor.content.find('p:first'))
			}
		})
		*/
	}
	
	page.Data_store.collect_edited = function()
	{
		var content = Markup.parse_and_validate(visual_editor.editor.html(), { syntax: 'html' })
		
		var data =
		{
			название: get_title(),
			содержимое: content
		}
		
		return data
	}
	
	page.save = function(data)
	{
		Режим.save_changes_to_server
		({
			anything_changed: function()
			{
				if (page.Data_store.unmodified_data.название != page.Data_store.edited_data.название)
					return true
				
				if (page.Data_store.unmodified_data.содержимое != page.Data_store.edited_data.содержимое)
					return true
				
				return false
			},
			
			validate: function()
			{
			},
			
			data:
			{
				_id: заметка,
				название: page.Data_store.edited_data.название,
				содержимое: page.Data_store.edited_data.содержимое,
				версия: page.data.версия
			},
			
			url: '/сеть/читальня/заметка',
			
			ok: function(data)
			{
				if (data.старая_версия)
				{
					info('Кто-то успел внести правки в эту заметку, пока вы её правили. В данное время ещё не написана система автоматического слияния правок, \nпоэтому мы предлагаем вам внести свои правки заново в <a href=\'' + Uri.parse(window.location).to_relative_url() + '\'>самую свежую версию этой заметки</a>. Для перенесения ваших правок, мы советуем вам воспользоваться инструментом «Исходный код» \n(который находится на панели инструментов, во второй строке)', {})
					return false
				}
			
				page.data.версия = data.версия
			
				if (data.путь)
					return go_to(text('pages.library.url') + '/' + data.путь)
			
				next_page_data.scrolled_before_refresh = прокрутчик.scrolled() - $('.visual_editor_tools_container').height()
			
				page.refresh()
			
				/*
				page.Data_store.unmodified_data =
				{
					название: data.название,
					содержимое: data.содержимое
				}
				
				set_title(data.название)
				visual_editor.editor.set_content(Markup.decorate(data.содержимое, { syntax: 'html' }))
				*/
			}
		})
	}
	
	/*
	page.discard = function()
	{
		return page.reload()
	
		// for later use
	
		var loading = loading_indicator.show()
		
		alert('Предоставьте _id')
		
		page.Ajax.delete('/сеть/черновик',
		{
			что: "заметка",
			_id: null
		})
		.ошибка(function(ошибка)
		{
			loading.hide()
			
			error(ошибка)
		})
		.ok(function(data)
		{
			loading.hide()
			
			Режим.обычный()
			
			visual_editor.editor.load_content(Markup.decorate(page.Data_store.unmodified_data.content, { syntax: 'html' }))
			
			postprocess_rich_content(visual_editor.editor.get_content())
			
			set_title(page.Data_store.unmodified_data.title)
		})
	}
	*/
})()