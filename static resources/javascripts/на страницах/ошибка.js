title('Ошибка')

page.needs_initializing = false
	
page.load = function()
{
	var ошибка = получить_настройку_запроса('ошибка')
	var адрес = получить_настройку_запроса('url')

	if (адрес)
	{
		page.get('.url').attr('href', адрес).text(адрес)
	}
}