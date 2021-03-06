(function()
{
	Режим.пообещать('правка')
	
	title(text('pages.bookshelf.title'))

	page.load = function()
	{
		title(text('pages.books.title') + '. ' + page.data.пользователь_сети.id)

		new text_button(page.get('.add_book')).does(function()
		{
			go_to('/сеть/книги')
		})
		
		Режим.добавить_проверку_перехода(function(из, в)
		{
			if (в === 'правка')
			{
				if (!page.data.пользователь_сети)
				{
					info('Здесь нечего править')
					return false
				}
				
				if (пользователь.id !== page.data.пользователь_сети.id)
				{
					info('Это не ваши личные данные, и вы не можете их править.')
					return false
				}
				
				//page.get('.bookshelf').find('.book').attr('draggable', true)
			}
			else if (из === 'правка')
			{
				//page.get('.bookshelf').find('.book').removeAttr('draggable')
			}
		})
		
		new Data_templater
		({
			template: 'книжный шкаф',
			container: $('.bookshelf_container'),
			single: true
		},
		new  Data_loader
		({
			url: '/человек/книги',
			parameters: { id: page.data.пользователь_сети.id },
			before_done: books_loaded,
			done: books_shown,
			get_data: function(data)
			{
				breadcrumbs
				([
					{ title: data.пользователь.имя, link: link_to('user', page.data.пользователь_сети.id) },
					{ title: text('pages.bookshelf.title'), link: link_to('user.bookshelf', page.data.пользователь_сети.id) }
				])
				
				var books = data.книги
				
				while (books.length % Configuration.Book_shelf_size > 0
						|| books.length < Configuration.Book_shelf_size * Configuration.Minimum_book_shelves)
				{
					books.push({})
				}
				
				var shelves = []
				
				while (books.length > Configuration.Book_shelf_size)
				{
					shelves.push({ books: books.splice(0, Configuration.Book_shelf_size) })
				}
				
				shelves.push({ books: books })
				
				return { shelves: shelves }
			}
		}))
		.show()
	}
	
	function books_loaded()
	{
		$('.bookshelf_container .book_place').transparent()
	}
	
	function books_shown()
	{
		$('.book.no_icon .author').fill_with_text({ Font_size_increment_step: 2 })
		$('.book.no_icon .title').fill_with_text({ 'center vertically': true, Font_size_increment_step: 2 })
		
		$('.book_place .book_info').each(function()
		{
			var info = $(this)
			var book_place = info.parent()
			
			info.css
			({
				left: -parseInt((info.outerWidth() - book_place.width()) / 2) + 'px',
				top: parseInt(book_place.height() * 0.9) + 'px'
			})
			
			info.hide()
			
			activate_popup
			({
				activator: book_place.find('.book'),
				popup: info,
				fade_in_duration: 0.0,
				fade_out_duration: 0.0
			})
		})
		
		$('.bookshelf_container .book_place').animate({ opacity: 1 }, 500)
			
		if (page.data.этот_пользователь)
		{
			$('.bookshelf_container .book').each(function()
			{
				create_context_menu($(this))
			})
				
			Режим.разрешить('правка')
		}
		
		page.content_ready()
	}
	
	function create_context_menu(book)
	{
		var list_item = book.parent()
		
		var menu_items = {}
		
		menu_items[text('pages.bookshelf.book.remove')] = function(_id)
		{
			page.Ajax.delete('/сеть/книжный шкаф', { _id: _id }).ok(function()
			{
				info(text('pages.bookshelf.book.removed'))
				page.refresh()
			})
		}
		
		var menu = book.context_menu(menu_items)
		
		menu.data = list_item.attr('_id')
	}
	
	page.save = function(данные)
	{
		info('Правка личного книжного шкафа пока не сделана')
		Режим.изменения_сохранены()
	}
})()