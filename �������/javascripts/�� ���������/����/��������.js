var conditional

function initialize_page()
{
	conditional = initialize_conditional($('[type=conditional]'))
	
	Ajax.get('/лекала/болталка.html', 
	{
		//cache: false,
		type: 'html',
		error: function()
		{
			conditional.callback('Не удалось загрузить страницу')
		},
		ok: function(template) 
		{
			$.template('болталка', template)
			
			Ajax.get('/приложение/болталка/сообщения',
			{
				error: function()
				{
					conditional.callback('Не удалось получить список сообщений')
				},
				ok: function(data)
				{
					//
					/*
					var data =
					{
						сообщения:
						[
							{
								отправитель: 'Иван Иванов', сообщение: 'Ицхак (Ицик) Виттенберг родился в Вильно в 1907 году в семье рабочего. Был членом подпольной коммунистической партии в Литве, после присоединения Литвы к СССР руководил профсоюзом. После оккупации Литвы немецкими войсками перешёл на нелегальное положение.', время: '24.10.2011 16:45'
							},
							{
								отправитель: 'Иван Иванов', сообщение: 'Dickinsonia (рус. дикинсония) — одно из наиболее характерных ископаемых животных эдиакарской (вендской) биоты. Как правило, представляет собой двусторонне-симметричное рифлёное овальное тело. Родственные связи организма в настоящее время неизвестны. Большинство исследователей относят дикинсоний к животным, однако существуют мнения, что они являются грибами или относятся к особому не существующему ныне царству живой природы.', время: '24.10.2011 16:46'
							},
							{
								отправитель: 'Василий Петров', сообщение: 'Овинище — Весьегонск — тупиковая однопутная 42-километровая железнодорожная линия, относящаяся к Октябрьской железной дороге, проходящая по территории Весьегонского района Тверской области (Россия) от путевого поста Овинище II, расположенного на железнодорожной линии Москва — Сонково — Мга — Санкт-Петербург (которая на разных участках называется Савёловским радиусом и Мологским ходом), до тупиковой станции Весьегонск и обеспечивающая связь расположенного на северо-восточной окраине Тверской области города Весьегонска с железнодорожной сетью страны.', время: '27.10.2011 10:20'
							}
						]
					}
					*/
					
					data.сообщения.reverse()
					var chat = $.tmpl('болталка', приготовить_данные_для_лекала(data.сообщения))
					chat.appendTo($('#chat'))
					
					conditional.callback()
					connect_to_chat()
				}
			})
		}
	})
}

var болталка

function connect_to_chat()
{
	болталка = io.connect('http://localhost:8080/болталка')
	
	болталка.on('connect', function()
	{
		болталка.emit('пользователь', пользователь.id)
	})
	
	болталка.on('готов', function()
	{
		// показать поле ввода и кнопку отправки
	})
}

function приготовить_данные_для_лекала(сообщения)
{
	var данные = { сообщения: [] }
	
	var обработанное_сообщение = {}
	сообщения.forEach(function(сообщение)
	{
		if (обработанное_сообщение.отправитель === сообщение.отправитель)
		{
			обработанное_сообщение.сообщения.push
			({
				сообщение: сообщение.сообщение,
				время: неточное_время(сообщение.время)
			})
			return
		}
		
		обработанное_сообщение =
		{
			отправитель: сообщение.отправитель,
			сообщения:
			[{
				сообщение: сообщение.сообщение,
				время: неточное_время(сообщение.время)
			}]
		}
		данные.сообщения.push(обработанное_сообщение)
	})
	
	return данные
}